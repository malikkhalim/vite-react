import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '_'
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method not allowed' } });
  }

  try {
    const { action, envelope } = req.body;
    
    // Log the request for debugging
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
    
    // For debugging
    console.log('Response received, parsing XML...');
    
    try {
      const parsedResponse = parser.parse(xmlResponse);
      
      // Extract the actual response data from SOAP envelope
      const responseBody = parsedResponse['SOAP-ENV:Envelope']['SOAP-ENV:Body'];
      const actionResponse = responseBody[`ns1:${action}Response`].return;
      
      return res.status(200).json({
        success: true,
        data: actionResponse
      });
    } catch (parseError) {
      console.error('XML parsing error:', parseError);
      return res.status(500).json({
        success: false,
        error: {
          message: 'Failed to parse SOAP response',
          details: parseError.message
        }
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