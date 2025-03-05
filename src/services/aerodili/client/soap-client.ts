export class SoapClient {
  static async execute(action: string, params: Record<string, any>) {
    try {
      const envelope = this.createSoapEnvelope(action, params);
      
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
        return {
          success: false,
          error: {
            code: result.error?.code || 'SOAP_ERROR',
            message: result.error?.message || 'SOAP request failed'
          }
        };
      }

      // Transform the complex XML structure into a clean JavaScript object
      const cleanedData = this.cleanXmlData(result.data);
      
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

  // Helper function to clean up XML response data with #text attributes
  private static cleanXmlData(data: any): any {
    if (!data) return data;
    
    // Handle arrays
    if (Array.isArray(data)) {
      return data.map(item => this.cleanXmlData(item));
    }
    
    // Handle objects
    if (typeof data === 'object') {
      // Special case for item arrays in SOAP responses
      if (data.item && Array.isArray(data.item)) {
        return this.cleanXmlData(data.item);
      }
      
      const result: Record<string, any> = {};
      
      for (const key in data) {
        // Skip XML type attributes
        if (key.startsWith('@_')) continue;
        
        // Handle XML text nodes
        if (key === '#text') {
          return data[key]; // Return the text value directly
        }
        
        // Handle normal XML elements with text nodes
        if (data[key] && typeof data[key] === 'object' && data[key]['#text'] !== undefined) {
          result[key] = data[key]['#text'];
        } else {
          result[key] = this.cleanXmlData(data[key]);
        }
      }
      
      return result;
    }
    
    // Return primitive values as is
    return data;
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