export class SoapClient {
  static async execute(action: string, params: Record<string, any>) {
    try {
      // Special handling for WsGeneratePNR which needs specific envelope structure
      const envelope = action === 'WsGeneratePNR' 
        ? this.createPNRSoapEnvelope(params)
        : this.createSoapEnvelope(action, params);
      
      console.log(`Sending ${action} request with envelope:`, envelope);
      
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

  // Special envelope for PNR generation with correct array structure
  private static createPNRSoapEnvelope(params: any): string {
    const {
      Username,
      Password,
      Received,
      ReceivedPhone,
      Email,
      SearchKey,
      AdultNames = [],
      ChildNames = [],
      InfantNames = [],
      Keys = []
    } = params;

    // Create the XML structure following the schema exactly
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
  xmlns:urn="urn:sj_service"
  xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"
  xmlns:tns="urn:webservice">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:WsGeneratePNR soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <param xsi:type="urn:reqWsGeneratePNR">
        <Username xsi:type="xsd:string">${Username}</Username>
        <Password xsi:type="xsd:string">${Password}</Password>
        <Received xsi:type="xsd:string">${Received}</Received>
        <ReceivedPhone xsi:type="xsd:string">${ReceivedPhone}</ReceivedPhone>
        <Email xsi:type="xsd:string">${Email}</Email>
        <SearchKey xsi:type="xsd:string">${SearchKey}</SearchKey>
        <ExtraCoverAddOns xsi:type="xsd:string">?</ExtraCoverAddOns>
        ${this.formatPNRAdultNames(AdultNames)}
        ${this.formatPNRChildNames(ChildNames)}
        ${this.formatPNRInfantNames(InfantNames)}
        ${this.formatPNRKeys(Keys)}
      </param>
    </urn:WsGeneratePNR>
  </soapenv:Body>
</soapenv:Envelope>`;
  }

  private static formatPNRAdultNames(adults: any[]): string {
    if (!adults || adults.length === 0) {
      return '<AdultNames xsi:type="urn:AdultNamesArray" soapenc:arrayType="urn:InputReqNameArray[0]"></AdultNames>';
    }

    const items = adults.map(adult => `
      <item xsi:type="tns:InputReqNameArray">
        <FirstName xsi:type="xsd:string">${adult.FirstName || ''}</FirstName>
        <LastName xsi:type="xsd:string">${adult.LastName || ''}</LastName>
        <Suffix xsi:type="xsd:string">${adult.Suffix || ''}</Suffix>
        <Dob xsi:type="xsd:string">${adult.Dob || '-'}</Dob>
        <IdNo xsi:type="xsd:string">${adult.IdNo || ''}</IdNo>
        <Passport xsi:type="urn:PassportArray" soapenc:arrayType="urn:InputPassportArray[1]">
          <item xsi:type="tns:InputPassportArray">
            <PassportNumber xsi:type="xsd:string">${adult.Passport?.PassportNumber || ''}</PassportNumber>
            <ExpiryDate xsi:type="xsd:string">${adult.Passport?.ExpiryDate || ''}</ExpiryDate>
            <IssuingCountry xsi:type="xsd:string">?</IssuingCountry>
            <IssuingDate xsi:type="xsd:string">?</IssuingDate>
          </item>
        </Passport>
      </item>
    `).join('');

    return `
      <AdultNames xsi:type="urn:AdultNamesArray" soapenc:arrayType="urn:InputReqNameArray[${adults.length}]">
        ${items}
      </AdultNames>
    `;
  }

  private static formatPNRChildNames(children: any[]): string {
    if (!children || children.length === 0) {
      return '<ChildNames xsi:type="urn:ChildNamesArray" soapenc:arrayType="urn:InputReqNameArray[0]"></ChildNames>';
    }

    const items = children.map(child => `
      <item xsi:type="tns:InputReqNameArray">
        <FirstName xsi:type="xsd:string">${child.FirstName || ''}</FirstName>
        <LastName xsi:type="xsd:string">${child.LastName || ''}</LastName>
        <Suffix xsi:type="xsd:string">${child.Suffix || ''}</Suffix>
        <Dob xsi:type="xsd:string">${child.Dob || ''}</Dob>
        <IdNo xsi:type="xsd:string">${child.IdNo || ''}</IdNo>
        <Passport xsi:type="urn:PassportArray" soapenc:arrayType="urn:InputPassportArray[1]">
          <item xsi:type="tns:InputPassportArray">
            <PassportNumber xsi:type="xsd:string">${child.Passport?.PassportNumber || ''}</PassportNumber>
            <ExpiryDate xsi:type="xsd:string">${child.Passport?.ExpiryDate || ''}</ExpiryDate>
            <IssuingCountry xsi:type="xsd:string">?</IssuingCountry>
            <IssuingDate xsi:type="xsd:string">?</IssuingDate>
          </item>
        </Passport>
      </item>
    `).join('');

    return `
      <ChildNames xsi:type="urn:ChildNamesArray" soapenc:arrayType="urn:InputReqNameArray[${children.length}]">
        ${items}
      </ChildNames>
    `;
  }

  private static formatPNRInfantNames(infants: any[]): string {
    if (!infants || infants.length === 0) {
      return '<InfantNames xsi:type="urn:InfantNamesArray" soapenc:arrayType="urn:InputReqArrayInf[0]"></InfantNames>';
    }

    const items = infants.map(infant => `
      <item xsi:type="tns:InputReqArrayInf">
        <FirstName xsi:type="xsd:string">${infant.FirstName || ''}</FirstName>
        <LastName xsi:type="xsd:string">${infant.LastName || ''}</LastName>
        <Dob xsi:type="xsd:string">${infant.Dob || ''}</Dob>
        <AdultRefference xsi:type="xsd:string">${infant.AdultRefference || '1'}</AdultRefference>
        <Passport xsi:type="urn:PassportArray" soapenc:arrayType="urn:InputPassportArray[1]">
          <item xsi:type="tns:InputPassportArray">
            <PassportNumber xsi:type="xsd:string">${infant.Passport?.PassportNumber || ''}</PassportNumber>
            <ExpiryDate xsi:type="xsd:string">${infant.Passport?.ExpiryDate || ''}</ExpiryDate>
            <IssuingCountry xsi:type="xsd:string">?</IssuingCountry>
            <IssuingDate xsi:type="xsd:string">?</IssuingDate>
          </item>
        </Passport>
      </item>
    `).join('');

    return `
      <InfantNames xsi:type="urn:InfantNamesArray" soapenc:arrayType="urn:InputReqArrayInf[${infants.length}]">
        ${items}
      </InfantNames>
    `;
  }

  private static formatPNRKeys(keys: any[]): string {
    if (!keys || keys.length === 0) {
      return '<Keys xsi:type="urn:InputReqArrayKey" soapenc:arrayType="urn:InputReqArrayKeys[0]"></Keys>';
    }

    const items = keys.map(key => `
      <item xsi:type="tns:InputReqArrayKeys">
        <Key xsi:type="xsd:string">${key.Key || ''}</Key>
        <Category xsi:type="xsd:string">${key.Category || ''}</Category>
      </item>
    `).join('');

    return `
      <Keys xsi:type="urn:InputReqArrayKey" soapenc:arrayType="urn:InputReqArrayKeys[${keys.length}]">
        ${items}
      </Keys>
    `;
  }

  // Regular SOAP envelope for other actions
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
}