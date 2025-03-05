import { XMLParser } from 'fast-xml-parser';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { action, envelope } = req.body;
    
    console.log(`Processing ${action} request`);
    
    // IMPORTANT: Use the correct endpoint URLs
    const wsdlUrl = 'http://demo-aerodili.nieve.id/wsdl.apiv12/index.php?wsdl';
    const soapUrl = 'http://demo-aerodili.nieve.id/wsdl.apiv12/index.php';
    
    const response = await fetch(wsdlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': `urn:sj_service#${action}`
      },
      body: envelope
    });

    if (!response.ok) {
      throw new Error(`SOAP request failed: ${response.statusText}`);
    }

    const xmlResponse = await response.text();
    
    // Check if the response is HTML instead of XML (error page)
    if (xmlResponse.includes('<html>') || xmlResponse.includes('<!DOCTYPE html>')) {
      return res.status(200).json({
        success: false,
        error: {
          message: 'Received HTML response instead of SOAP XML',
          details: 'The API endpoint returned an HTML page instead of a SOAP response'
        },
        xmlResponse: xmlResponse.substring(0, 1000) // First 1000 chars for debugging
      });
    }
    
    // Parse the XML response
    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
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
      
      // Check for SOAP envelope
      if (!parsedResponse['SOAP-ENV:Envelope']) {
        return res.status(200).json({
          success: false,
          error: { message: 'Invalid SOAP response envelope' },
          xmlResponse: xmlResponse.substring(0, 1000)
        });
      }
      
      // Get the response body
      const body = parsedResponse['SOAP-ENV:Envelope']['SOAP-ENV:Body'];
      if (!body) {
        return res.status(200).json({
          success: false,
          error: { message: 'Missing SOAP body in response' },
          xmlResponse: xmlResponse.substring(0, 1000)
        });
      }
      
      // Find the response element - it will be named after the action
      const responseKey = Object.keys(body).find(key => 
        key.includes(`${action}Response`) || key.endsWith(`:${action}Response`)
      );
      
      if (!responseKey) {
        return res.status(200).json({
          success: false,
          error: { 
            message: 'Could not find response element in SOAP body',
            availableKeys: Object.keys(body).join(', ')
          },
          xmlResponse: xmlResponse.substring(0, 1000)
        });
      }
      
      const responseObj = body[responseKey];
      
      // Extract the return value
      if (!responseObj.return) {
        return res.status(200).json({
          success: false,
          error: { message: 'Missing return value in response' },
          responseObj: responseObj,
          xmlResponse: xmlResponse.substring(0, 1000)
        });
      }
      
      return res.status(200).json({
        success: true,
        data: responseObj.return
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