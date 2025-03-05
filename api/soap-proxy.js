import { XMLParser } from 'fast-xml-parser';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { action, envelope } = req.body;
    
    console.log(`Processing ${action} request`);
    
    // Use the correct SOAP endpoint (without ?wsdl)
    const endpoint = 'https://demo-aerodili.nieve.id/wsdl.apiv12/index.php';
    
    // Set the correct SOAPAction header format
    const soapAction = `urn:sj_service#${action}`;
    
    console.log(`SOAP Action: ${soapAction}`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': soapAction
      },
      body: envelope
    });

    if (!response.ok) {
      throw new Error(`SOAP request failed: ${response.statusText}`);
    }

    const xmlResponse = await response.text();
    
    console.log(`Response received (${xmlResponse.length} characters)`);
    
    // If the response contains WSDL definition, it's not a valid SOAP response
    if (xmlResponse.includes('<definitions') || xmlResponse.includes('<wsdl:definitions')) {
      return res.status(200).json({
        success: false,
        error: {
          message: 'Received WSDL instead of SOAP response',
          details: 'Got WSDL definition instead of a SOAP response, check SOAP configuration'
        },
        xmlResponse: xmlResponse.substring(0, 1000)
      });
    }
    
    // Check if the response is HTML (error page)
    if (xmlResponse.includes('<html>') || xmlResponse.includes('<!DOCTYPE html>')) {
      return res.status(200).json({
        success: false,
        error: {
          message: 'Received HTML response instead of SOAP XML',
          details: 'The API endpoint returned an HTML page instead of a SOAP response'
        },
        xmlResponse: xmlResponse.substring(0, 1000)
      });
    }
    
    // Parse the XML response
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      isArray: (name) => {
        // These elements should always be treated as arrays
        return ['item', 'TripDetail', 'FlightRoute', 'Segments', 'ClassesAvailable'].includes(name);
      }
    });
    
    try {
      const parsedResponse = parser.parse(xmlResponse);
      
      console.log("Parsed response keys:", Object.keys(parsedResponse));
      
      // Extract the SOAP envelope
      const soapEnv = parsedResponse['SOAP-ENV:Envelope'];
      if (!soapEnv) {
        return res.status(200).json({
          success: false,
          error: { message: 'Invalid SOAP response envelope' },
          parsedKeys: Object.keys(parsedResponse),
          xmlResponse: xmlResponse.substring(0, 1000)
        });
      }
      
      // Extract the SOAP body
      const soapBody = soapEnv['SOAP-ENV:Body'];
      if (!soapBody) {
        return res.status(200).json({
          success: false,
          error: { message: 'Missing SOAP body' },
          xmlResponse: xmlResponse.substring(0, 1000)
        });
      }
      
      // Find the response element for this action
      const responseKey = Object.keys(soapBody).find(key => 
        key.includes(`${action}Response`)
      );
      
      if (!responseKey) {
        return res.status(200).json({
          success: false,
          error: { 
            message: 'Missing response element in SOAP body',
            bodyKeys: Object.keys(soapBody).join(', ')
          },
          xmlResponse: xmlResponse.substring(0, 1000)
        });
      }
      
      // Extract the return value
      const responseObj = soapBody[responseKey];
      const returnValue = responseObj.return;
      
      if (!returnValue) {
        return res.status(200).json({
          success: false,
          error: { message: 'Missing return value in response' },
          responseObj: responseObj,
          xmlResponse: xmlResponse.substring(0, 1000)
        });
      }

      if (action === 'WsGeneratePNR') {
        console.log("Processing WsGeneratePNR response");
        // Add the full return value for debugging
        console.log("Return value:", JSON.stringify(returnValue).substring(0, 500) + '...');
      }
      
      return res.status(200).json({
        success: true,
        data: returnValue
      });
    } catch (parseError) {
      console.error('XML parsing error:', parseError);
      return res.status(200).json({
        success: false,
        error: {
          message: 'Failed to parse SOAP response',
          details: parseError.message
        },
        xmlResponse: xmlResponse.substring(0, 1000)
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