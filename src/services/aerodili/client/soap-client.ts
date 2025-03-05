// src/services/aerodili/client/soap-client.ts

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

      // Special handling for WsRouteOperate response
      if (action === 'WsRouteOperate' && result.data) {
        // Transform the RouteOperates array to a proper array if it's not already
        if (result.data.RouteOperates && !Array.isArray(result.data.RouteOperates)) {
          if (result.data.RouteOperates.item && Array.isArray(result.data.RouteOperates.item)) {
            // If it's in the form of {item: [...]} extract the item array
            result.data.RouteOperates = result.data.RouteOperates.item;
          } else {
            // If it's a single item, wrap it in an array
            result.data.RouteOperates = [result.data.RouteOperates];
          }
        }
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