export class SoapClient {
  static async execute(action, params) {
    try {
      const envelope = this.createEnvelope(action, params);
      
      // Call our Vercel API endpoint
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
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `SOAP request failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        return {
          success: false,
          error: result.error
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

  static createEnvelope(action, params) {
    // Replace environment variables in params
    const processedParams = {
      ...params,
      Username: process.env.NEXT_PUBLIC_AERODILI_USERNAME || 'DILTRAVEL002',
      Password: process.env.NEXT_PUBLIC_AERODILI_PASSWORD || 'Abc12345'
    };

    return `
      <soapenv:Envelope 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
        xmlns:urn="urn:sj_service">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:${action} soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <param xsi:type="urn:req${action}" xmlns:urn="urn:webservice">
              ${this.formatParams(processedParams)}
            </param>
          </urn:${action}>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  }

  private static formatParams(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => {
        if (typeof value === 'object' && Array.isArray(value)) {
          // Handle arrays
          return `<${key} xsi:type="urn:${key}Array" soapenc:arrayType="urn:InputReqNameArray[${value.length}]">
            ${value.map((item: any) => this.formatArrayItem(item)).join('')}
          </${key}>`;
        } else if (typeof value === 'object' && value !== null) {
          // Handle nested objects
          return `<${key}>
            ${this.formatParams(value)}
          </${key}>`;
        } else {
          // Handle primitive values
          return `<${key} xsi:type="xsd:string">${value}</${key}>`;
        }
      })
      .join('\n');
  }

  private static formatArrayItem(item: any): string {
    return `<item xsi:type="tns:InputReqNameArray">
      ${this.formatParams(item)}
    </item>`;
  }
}