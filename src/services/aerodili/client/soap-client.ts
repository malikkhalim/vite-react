export class SoapClient {
  static async execute(action: string, params: Record<string, any>) {
    try {
      const envelope = this.createSoapEnvelope(action, params);

      console.log(`Sending ${action} request`);
      
      const response = await fetch('/api/soap-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          envelope
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        console.error('SOAP error response:', result.error);
        if (result.xmlResponse) {
          console.log('Raw XML response (truncated):', result.xmlResponse);
        }
        
        return {
          success: false,
          error: {
            code: result.error.code || 'SOAP_ERROR',
            message: result.error.message || 'SOAP request failed'
          }
        };
      }

      // Clean and normalize the response data
      const cleanedData = this.cleanResponseData(result.data, action);

      return {
        success: true,
        data: cleanedData
      };
    } catch (error) {
      console.error('SOAP client error:', error);
      return {
        success: false,
        error: {
          code: 'SOAP_ERROR',
          message: error instanceof Error ? error.message : 'SOAP request failed'
        }
      };
    }
  }

  // Helper method to clean and normalize response data
  private static cleanResponseData(data: any, action: string): any {
    if (!data) return data;

    // Handle specific actions
    if (action === 'WsRouteOperate' && data.RouteOperates) {
      // Transform RouteOperates into a clean array
      let routeItems = [];
      
      if (Array.isArray(data.RouteOperates)) {
        routeItems = data.RouteOperates;
      } else if (data.RouteOperates.item && Array.isArray(data.RouteOperates.item)) {
        routeItems = data.RouteOperates.item;
      } else {
        routeItems = [data.RouteOperates];
      }
      
      // Clean each item in the array
      data.RouteOperates = routeItems.map(item => this.cleanXmlObject(item));
    }

    return this.cleanXmlObject(data);
  }

  // Recursively clean XML-parsed objects
  private static cleanXmlObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanXmlObject(item));
    }
    
    // Handle objects
    const cleanObj: any = {};
    
    for (const key in obj) {
      // Skip special XML attributes
      if (key.startsWith('@_') || key === '#text') continue;
      
      // Extract text value if it's an XML element object
      if (obj[key] && typeof obj[key] === 'object' && obj[key]['#text'] !== undefined) {
        cleanObj[key] = obj[key]['#text'];
      } else {
        // Clean nested objects
        cleanObj[key] = this.cleanXmlObject(obj[key]);
      }
    }
    
    return cleanObj;
  }

  private static createSoapEnvelope(action: string, params: Record<string, any>): string {
    // Process credentials
    const allParams = {
      Username: 'DILTRAVEL002',
      Password: 'Abc12345',
      ...params
    };

    // Create the SOAP envelope with correct namespaces and encoding style
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:urn="urn:sj_service"
  xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:${action} soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <param xsi:type="urn:req${action}">
        ${this.formatParams(allParams)}
      </param>
    </urn:${action}>
  </soapenv:Body>
</soapenv:Envelope>`;
  }

  private static formatParams(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return `<${key} xsi:type="xsd:string">?</${key}>`;
        } else if (typeof value === 'object') {
          // Handle nested objects
          return `<${key}>${this.formatParams(value)}</${key}>`;
        } else {
          return `<${key} xsi:type="xsd:string">${value}</${key}>`;
        }
      })
      .join('\n');
  }
}