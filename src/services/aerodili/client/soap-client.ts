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

      return {
        success: true,
        data: result.data
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

  private static createSoapEnvelope(action: string, params: Record<string, any>): string {
    // Process credentials
    const allParams = {
      Username: 'DILTRAVEL002',
      Password: 'Abc12345',
      ...params
    };

    // Create the SOAP envelope with correct namespaces and encoding style
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    <soapenv:Envelope 
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
      xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" 
      xmlns:urn="urn:sj_service"
      xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/"
      <soapenv:Body>
        <urn:${action} soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
          <param xsi:type="urn:req${action}">
            ${this.formatParams(allParams)}
          </param>
        </urn:${action}>
      </soapenv:Body>
    </soapenv:Envelope>'`;
  }

  private static formatParams(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => {
        if (value === undefined || value === null || value === '') {
          return `<${key} xsi:type="xsd:string">?</${key}>`;
        } else if (typeof value === 'object' && Array.isArray(value)) {
          if (value.length === 0) {
            return `<${key} xsi:nil="true" xsi:type="SOAP-ENC:Array"/>`;
          }
          // Handle arrays
          return `<${key} xsi:type="SOAP-ENC:Array">
            ${value.map((item) =>
            `<item>${typeof item === 'object' ? this.formatParams(item) : item}</item>`
          ).join('')}
          </${key}>`;
        } else if (typeof value === 'object') {
          // Handle nested objects
          return `<${key}>${this.formatParams(value)}</${key}>`;
        } else {
          // Handle primitive values
          return `<${key} xsi:type="xsd:string">${value}</${key}>`;
        }
      })
      .join('\n');
  }
}