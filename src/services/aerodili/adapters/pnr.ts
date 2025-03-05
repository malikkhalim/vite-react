import { format } from 'date-fns';
import { SoapClient } from '../client/soap-client';
import type { PassengerData } from '../../../types/passenger';
import type { Flight } from '../../../types/flight';

export class PNRAdapter {
  static async generatePNR(
    passengers: PassengerData[],
    contactDetails: {
      name: string;
      phone: string;
      email: string;
    },
    flight: Flight,
    returnFlight?: Flight
  ) {
    try {
      console.log("Generating PNR with:", { passengers, contactDetails, flight, returnFlight });
      
      // Filter passengers by type
      const adultPassengers = passengers.filter(p => p.type === 'adult');
      const childPassengers = passengers.filter(p => p.type === 'child');
      const infantPassengers = passengers.filter(p => p.type === 'infant');

      console.log("Passenger counts:", {
        adults: adultPassengers.length,
        children: childPassengers.length,
        infants: infantPassengers.length
      });

      // Create request data with explicit defaults for all fields
      const requestData: Record<string, any> = {
        Username: 'DILTRAVEL002',
        Password: 'Abc12345',
        Received: 'AGENT',
        ReceivedPhone: contactDetails.phone || '',
        Email: contactDetails.email ? contactDetails.email.toUpperCase() : '',
        SearchKey: flight.searchKey || '',
        Keys: [
          {
            Key: flight.classKey || '',
            Category: 'Departure'
          }
        ]
      };

      // Only add return flight key if it exists
      if (returnFlight && returnFlight.classKey) {
        requestData.Keys.push({
          Key: returnFlight.classKey,
          Category: 'Return'
        });
      }

      // Add adult passenger info - always include this field
      requestData.AdultNames = adultPassengers.map(p => ({
        FirstName: p.firstName ? p.firstName.toUpperCase() : '',
        LastName: p.lastName ? p.lastName.toUpperCase() : '',
        Suffix: p.salutation || '',
        Dob: '-',
        IdNo: p.passportNumber || '',
        Passport: {
          PassportNumber: p.passportNumber || '',
          ExpiryDate: p.passportExpiry ? format(new Date(p.passportExpiry), 'dd-MMM-yy') : ''
        }
      }));

      // Add child passenger info - only if we have child passengers
      if (childPassengers.length > 0) {
        requestData.ChildNames = childPassengers.map(p => ({
          FirstName: p.firstName ? p.firstName.toUpperCase() : '',
          LastName: p.lastName ? p.lastName.toUpperCase() : '',
          Suffix: p.salutation || '',
          Dob: p.dateOfBirth ? format(new Date(p.dateOfBirth), 'yyyy-MM-dd') : '',
          IdNo: p.passportNumber || '',
          Passport: {
            PassportNumber: p.passportNumber || '',
            ExpiryDate: p.passportExpiry ? format(new Date(p.passportExpiry), 'dd-MMM-yy') : ''
          }
        }));
      } else {
        // Include empty array if there are no children
        requestData.ChildNames = [];
      }

      // Add infant passenger info - only if we have infant passengers
      if (infantPassengers.length > 0) {
        requestData.InfantNames = infantPassengers.map((p, index) => ({
          FirstName: p.firstName ? p.firstName.toUpperCase() : '',
          LastName: p.lastName ? p.lastName.toUpperCase() : '',
          Dob: p.dateOfBirth ? format(new Date(p.dateOfBirth), 'yyyy-MM-dd') : '',
          AdultRefference: (index + 1).toString(),
          Passport: {
            PassportNumber: p.passportNumber || '',
            ExpiryDate: p.passportExpiry ? format(new Date(p.passportExpiry), 'dd-MMM-yy') : ''
          }
        }));
      } else {
        // Include empty array if there are no infants
        requestData.InfantNames = [];
      }

      console.log("PNR request data:", JSON.stringify(requestData, null, 2));

      // Instead of using the standard SOAP client, let's create a custom one for this call
      // that can handle arrays differently
      const response = await this.executePnrRequest(requestData);

      console.log("PNR response:", response);

      if (!response.success) {
        throw new Error(response.error?.message || 'PNR generation failed');
      }

      // Extract booking details from response with defaults
      return {
        bookingCode: response.data?.BookingCode || '',
        status: response.data?.YourItineraryDetails?.ReservationDetails?.Status || 'pending',
        totalAmount: parseFloat(response.data?.YourItineraryDetails?.PaymentDetails?.Total || '0')
      };
    } catch (error) {
      console.error("PNR generation error:", error);
      throw error;
    }
  }

  // Special SOAP client method for PNR generation
  private static async executePnrRequest(requestData: Record<string, any>) {
    try {
      // Generate a SOAP envelope that specifically handles arrays correctly
      const envelope = this.createSoapEnvelopeForPnr(requestData);
      
      console.log("SOAP Envelope:", envelope);
      
      const response = await fetch('/api/soap-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'WsGeneratePNR',
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

  // Custom envelope creator specifically for PNR generation
  private static createSoapEnvelopeForPnr(params: Record<string, any>): string {
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
    <urn:WsGeneratePNR soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <param xsi:type="urn:reqWsGeneratePNR">
        ${this.formatParamsForPnr(params)}
      </param>
    </urn:WsGeneratePNR>
  </soapenv:Body>
</soapenv:Envelope>`;
  }

  // Custom parameter formatter for PNR generation
  private static formatParamsForPnr(params: Record<string, any>): string {
    const parts: string[] = [];
    
    // Handle simple key-value pairs
    for (const [key, value] of Object.entries(params)) {
      if (key === 'AdultNames' || key === 'ChildNames' || key === 'InfantNames' || key === 'Keys') {
        // Skip array fields - we'll handle them separately
        continue;
      }
      
      if (value === undefined || value === null || value === '') {
        parts.push(`<${key} xsi:type="xsd:string">?</${key}>`);
      } else if (typeof value === 'object') {
        // Handle nested objects
        parts.push(`<${key}>${this.formatParamsForPnr(value)}</${key}>`);
      } else {
        parts.push(`<${key} xsi:type="xsd:string">${value}</${key}>`);
      }
    }
    
    // Handle AdultNames array
    if (params.AdultNames && Array.isArray(params.AdultNames)) {
      if (params.AdultNames.length > 0) {
        const adultItems = params.AdultNames.map((adult: any) => 
          `<item>
            <FirstName xsi:type="xsd:string">${adult.FirstName}</FirstName>
            <LastName xsi:type="xsd:string">${adult.LastName}</LastName>
            <Suffix xsi:type="xsd:string">${adult.Suffix}</Suffix>
            <Dob xsi:type="xsd:string">${adult.Dob}</Dob>
            <IdNo xsi:type="xsd:string">${adult.IdNo}</IdNo>
            <Passport>
              <PassportNumber xsi:type="xsd:string">${adult.Passport.PassportNumber}</PassportNumber>
              <ExpiryDate xsi:type="xsd:string">${adult.Passport.ExpiryDate}</ExpiryDate>
            </Passport>
          </item>`
        ).join('');
        
        parts.push(`
          <AdultNames xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="tns:AdultNamesArrays[${params.AdultNames.length}]">
            ${adultItems}
          </AdultNames>
        `);
      } else {
        // Empty array
        parts.push(`
          <AdultNames xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="tns:AdultNamesArrays[0]">
          </AdultNames>
        `);
      }
    }
    
    // Handle ChildNames array (if present)
    if (params.ChildNames && Array.isArray(params.ChildNames)) {
      if (params.ChildNames.length > 0) {
        const childItems = params.ChildNames.map((child: any) => 
          `<item>
            <FirstName xsi:type="xsd:string">${child.FirstName}</FirstName>
            <LastName xsi:type="xsd:string">${child.LastName}</LastName>
            <Suffix xsi:type="xsd:string">${child.Suffix}</Suffix>
            <Dob xsi:type="xsd:string">${child.Dob}</Dob>
            <IdNo xsi:type="xsd:string">${child.IdNo}</IdNo>
            <Passport>
              <PassportNumber xsi:type="xsd:string">${child.Passport.PassportNumber}</PassportNumber>
              <ExpiryDate xsi:type="xsd:string">${child.Passport.ExpiryDate}</ExpiryDate>
            </Passport>
          </item>`
        ).join('');
        
        parts.push(`
          <ChildNames xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="tns:ChildNamesArrays[${params.ChildNames.length}]">
            ${childItems}
          </ChildNames>
        `);
      } else {
        // Empty array
        parts.push(`
          <ChildNames xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="tns:ChildNamesArrays[0]">
          </ChildNames>
        `);
      }
    }
    
    // Handle InfantNames array (if present)
    if (params.InfantNames && Array.isArray(params.InfantNames)) {
      if (params.InfantNames.length > 0) {
        const infantItems = params.InfantNames.map((infant: any) => 
          `<item>
            <FirstName xsi:type="xsd:string">${infant.FirstName}</FirstName>
            <LastName xsi:type="xsd:string">${infant.LastName}</LastName>
            <Dob xsi:type="xsd:string">${infant.Dob}</Dob>
            <AdultRefference xsi:type="xsd:string">${infant.AdultRefference}</AdultRefference>
            <Passport>
              <PassportNumber xsi:type="xsd:string">${infant.Passport.PassportNumber}</PassportNumber>
              <ExpiryDate xsi:type="xsd:string">${infant.Passport.ExpiryDate}</ExpiryDate>
            </Passport>
          </item>`
        ).join('');
        
        parts.push(`
          <InfantNames xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="tns:InfantNamesArrays[${params.InfantNames.length}]">
            ${infantItems}
          </InfantNames>
        `);
      } else {
        // Empty array
        parts.push(`
          <InfantNames xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="tns:InfantNamesArrays[0]">
          </InfantNames>
        `);
      }
    }
    
    // Handle Keys array
    if (params.Keys && Array.isArray(params.Keys)) {
      const keyItems = params.Keys.map((key: any) => 
        `<item>
          <Key xsi:type="xsd:string">${key.Key}</Key>
          <Category xsi:type="xsd:string">${key.Category}</Category>
        </item>`
      ).join('');
      
      parts.push(`
        <Keys xsi:type="SOAP-ENC:Array" SOAP-ENC:arrayType="tns:KeysArrays[${params.Keys.length}]">
          ${keyItems}
        </Keys>
      `);
    }
    
    return parts.join('\n');
  }
}