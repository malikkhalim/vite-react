export class SoapClient {

  static async debugSoapRequest() {
    try {
      // Verify WSDL URL
      const wsdlUrl = 'http://demo-aerodili.nieve.id/wsdl.apiv12/index.php?wsdl';
      
      // Fetch WSDL to confirm accessibility
      const wsdlResponse = await fetch(wsdlUrl);
      const wsdlText = await wsdlResponse.text();
      
      console.log('WSDL Fetch Status:', wsdlResponse.status);
      console.log('WSDL Content Length:', wsdlText.length);

      // Check authentication
      const soapUrl = 'http://demo-aerodili.nieve.id/wsdl.apiv12/index.php';
      const envelope = `
        <soapenv:Envelope 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xmlns:xsd="http://www.w3.org/2001/XMLSchema"
          xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
          xmlns:urn="urn:sj_service">
          <soapenv:Header/>
          <soapenv:Body>
            <urn:WsSearchFlight soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
              <param xsi:type="urn:reqWsSearchFlight">
                <Username>DILTRAVEL002</Username>
                <Password>Abc12345</Password>
                <ReturnStatus>NO</ReturnStatus>
                <CityFrom>DIL</CityFrom>
                <CityTo>DRW</CityTo>
                <DepartDate>01-Mar-24</DepartDate>
                <Adult>1</Adult>
                <Child>0</Child>
                <Infant>0</Infant>
              </param>
            </urn:WsSearchFlight>
          </soapenv:Body>
        </soapenv:Envelope>
      `;

      const soapResponse = await fetch(soapUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8',
          'SOAPAction': 'urn:sj_service#WsSearchFlight'
        },
        body: envelope
      });

      console.log('SOAP Response Status:', soapResponse.status);
      const responseText = await soapResponse.text();
      console.log('SOAP Response:', responseText);

      return {
        wsdlStatus: wsdlResponse.status,
        wsdlContentLength: wsdlText.length,
        soapResponseStatus: soapResponse.status,
        soapResponseText: responseText
      };

    } catch (error) {
      console.error('Debugging Error:', error);
      throw error;
    }
  }

  static async execute(action: string, params: Record<string, any>) {
    try {
      const envelope = this.createEnvelope(action, params);

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
          console.log('Raw XML response:', result.xmlResponse);
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

  private static createEnvelope(action: string, params: Record<string, any>): string {
    // Process credentials
    const allParams = {
      Username: 'DILTRAVEL002',
      Password: 'Abc12345',
      ...params
    };

    return `
      <soapenv:Envelope 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xsd="http://www.w3.org/2001/XMLSchema"
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
        xmlns:urn="urn:sj_service"
        xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/">
        <soapenv:Header/>
        <soapenv:Body>
          <urn:${action} soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
            <param xsi:type="urn:req${action}" xmlns:urn="urn:webservice">
              ${this.formatParams(allParams)}
            </param>
          </urn:${action}>
        </soapenv:Body>
      </soapenv:Envelope>
    `;
  }

  private static formatParams(params: Record<string, any>): string {
    return Object.entries(params)
      .map(([key, value]) => {
        if (value === undefined || value === null) {
          return `<${key} xsi:type="xsd:string">?</${key}>`;
        } else if (typeof value === 'object' && Array.isArray(value)) {
          if (value.length === 0) {
            return `<${key} xsi:nil="true" xsi:type="SOAP-ENC:Array"/>`;
          }
          // Handle arrays
          return `<${key} xsi:type="SOAP-ENC:Array">
            ${value.map((item, index) => 
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