import { format } from 'date-fns';
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
      
      // Create a direct XML envelope - no JSON transformation
      const envelope = this.createDirectPNREnvelope(
        adultPassengers,
        childPassengers,
        infantPassengers,
        contactDetails,
        flight,
        returnFlight
      );
      
      console.log("PNR raw envelope:", envelope);
      
      // Send directly to the proxy
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
      
      console.log("PNR API result:", result);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'PNR generation failed');
      }
      
      // Extract booking details
      const data = result.data;
      const bookingCode = data?.BookingCode || '';
      
      // Check if we have a booking code
      if (!bookingCode) {
        throw new Error('No booking code returned from API');
      }
      
      return {
        bookingCode,
        status: 'pending',
        totalAmount: 0 // We'll get this in a later step
      };
    } catch (error) {
      console.error("PNR generation error:", error);
      throw error;
    }
  }
  
  private static createDirectPNREnvelope(
    adults: PassengerData[],
    children: PassengerData[],
    infants: PassengerData[],
    contactDetails: { name: string; phone: string; email: string },
    flight: Flight,
    returnFlight?: Flight
  ): string {
    // Format adult passenger XML
    const adultXML = adults.map((adult, index) => {
      return `<item>
        <FirstName>${adult.firstName.toUpperCase()}</FirstName>
        <LastName>${adult.lastName.toUpperCase()}</LastName>
        <Suffix>${adult.salutation}</Suffix>
        <Dob>-</Dob>
        <IdNo>${adult.passportNumber}</IdNo>
        <Passport>
          <item>
            <PassportNumber>${adult.passportNumber}</PassportNumber>
            <ExpiryDate>${format(new Date(adult.passportExpiry), 'dd-MMM-yy')}</ExpiryDate>
            <IssuingCountry>?</IssuingCountry>
            <IssuingDate>?</IssuingDate>
          </item>
        </Passport>
      </item>`;
    }).join('');
    
    // Format child passenger XML
    const childXML = children.map((child, index) => {
      return `<item>
        <FirstName>${child.firstName.toUpperCase()}</FirstName>
        <LastName>${child.lastName.toUpperCase()}</LastName>
        <Suffix>${child.salutation}</Suffix>
        <Dob>${format(new Date(child.dateOfBirth), 'yyyy-MM-dd')}</Dob>
        <IdNo>${child.passportNumber}</IdNo>
        <Passport>
          <item>
            <PassportNumber>${child.passportNumber}</PassportNumber>
            <ExpiryDate>${format(new Date(child.passportExpiry), 'dd-MMM-yy')}</ExpiryDate>
            <IssuingCountry>?</IssuingCountry>
            <IssuingDate>?</IssuingDate>
          </item>
        </Passport>
      </item>`;
    }).join('');
    
    // Format infant passenger XML
    const infantXML = infants.map((infant, index) => {
      return `<item>
        <FirstName>${infant.firstName.toUpperCase()}</FirstName>
        <LastName>${infant.lastName.toUpperCase()}</LastName>
        <Dob>${format(new Date(infant.dateOfBirth), 'yyyy-MM-dd')}</Dob>
        <AdultRefference>1</AdultRefference>
        <Passport>
          <item>
            <PassportNumber>${infant.passportNumber}</PassportNumber>
            <ExpiryDate>${format(new Date(infant.passportExpiry), 'dd-MMM-yy')}</ExpiryDate>
            <IssuingCountry>?</IssuingCountry>
            <IssuingDate>?</IssuingDate>
          </item>
        </Passport>
      </item>`;
    }).join('');
    
    // Format keys XML
    let keysXML = `<item>
      <Key>${flight.classKey}</Key>
      <Category>Departure</Category>
    </item>`;
    
    if (returnFlight && returnFlight.classKey) {
      keysXML += `<item>
        <Key>${returnFlight.classKey}</Key>
        <Category>Return</Category>
      </item>`;
    }
    
    // Create the full envelope with plain XML - no type attributes or namespaces
    // This simplification might help avoid the complex SOAP structure issues
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope 
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:urn="urn:sj_service">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:WsGeneratePNR>
      <param>
        <Username>DILTRAVEL002</Username>
        <Password>Abc12345</Password>
        <Received>AGENT</Received>
        <ReceivedPhone>${contactDetails.phone || ''}</ReceivedPhone>
        <Email>${contactDetails.email.toUpperCase()}</Email>
        <SearchKey>${flight.searchKey}</SearchKey>
        <ExtraCoverAddOns>?</ExtraCoverAddOns>
        <AdultNames>${adultXML}</AdultNames>
        <ChildNames>${childXML}</ChildNames>
        <InfantNames>${infantXML}</InfantNames>
        <Keys>${keysXML}</Keys>
      </param>
    </urn:WsGeneratePNR>
  </soapenv:Body>
</soapenv:Envelope>`;
  }
}
