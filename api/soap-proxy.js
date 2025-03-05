import { XMLParser } from 'fast-xml-parser';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { action, envelope } = req.body;
    
    console.log(`Processing ${action} request`);
    
    const response = await fetch('http://demo-aerodili.nieve.id/wsdl.apiv12/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': action
      },
      body: envelope
    });

    if (!response.ok) {
      throw new Error(`SOAP request failed: ${response.statusText}`);
    }

    const xmlResponse = await response.text();
    
    // Send the raw XML response back if parsing fails
    // This allows client-side debugging
    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: '_',
      parseAttributeValue: false,
      trimValues: true,
      isArray: (name) => {
        // These fields should always be treated as arrays even if only one item
        return ['item', 'TripDetail', 'FlightRoute', 'Segments', 'ClassesAvailable', 
                'AdultNames', 'ChildNames', 'InfantNames', 'Keys'].includes(name);
      }
    };
    
    const parser = new XMLParser(options);
    
    try {
      const parsedResponse = parser.parse(xmlResponse);
      
      // Extract the actual response from SOAP envelope
      const envelope = parsedResponse['SOAP-ENV:Envelope'];
      if (!envelope) {
        return res.status(200).json({
          success: false,
          error: { message: 'Invalid SOAP response envelope' },
          xmlResponse: xmlResponse.substring(0, 1000) // First 1000 chars for debugging
        });
      }
      
      const body = envelope['SOAP-ENV:Body'];
      if (!body) {
        return res.status(200).json({
          success: false,
          error: { message: 'Invalid SOAP response body' },
          xmlResponse: xmlResponse.substring(0, 1000)
        });
      }
      
      // Find the response element - it will have the name format: ns1:{action}Response
      const responseKey = Object.keys(body).find(key => 
        key.includes(`${action}Response`) || key.endsWith(`:${action}Response`)
      );
      
      if (!responseKey) {
        return res.status(200).json({
          success: false,
          error: { message: 'Could not find response element in SOAP body' },
          xmlResponse: xmlResponse.substring(0, 1000),
          bodyKeys: Object.keys(body)
        });
      }
      
      const responseObj = body[responseKey];
      const result = responseObj.return;
      
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (parseError) {
      console.error('XML parsing error:', parseError);
      return res.status(200).json({
        success: false,
        error: {
          message: 'Failed to parse SOAP response',
          details: parseError.message
        },
        xmlResponse: xmlResponse.substring(0, 1000) // Send first part of XML for debugging
      });
    }
  } catch (error) {
    console.error('SOAP proxy error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'SOAP request failed'
      }
    });
  }
}