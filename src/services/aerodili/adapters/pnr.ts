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
      
      // Create the exact SOAP envelope structure
      const envelope = this.createPnrEnvelope(
        adultPassengers,
        childPassengers,
        infantPassengers,
        contactDetails,
        flight,
        returnFlight
      );
      
      console.log("PNR envelope:", envelope);
      
      // Send the SOAP request via our proxy
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
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log("PNR response:", result);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'PNR generation failed');
      }
      
      // Extract booking details from response
      const bookingCode = result.data?.BookingCode;
      if (!bookingCode) {
        throw new Error('No booking code returned from API');
      }
      
      return {
        bookingCode,
        status: 'pending',
        totalAmount: 0
      };
    } catch (error) {
      console.error("PNR generation error:", error);
      throw error;
    }
  }
  
  private static createPnrEnvelope(
    adults: PassengerData[],
    children: PassengerData[],
    infants: PassengerData[],
    contactDetails: { name: string; phone: string; email: string },
    flight: Flight,
    returnFlight?: Flight
  ): string {
    // First handle the Adult array
    let adultNames = '';
    if (adults.length > 0) {
      const adultItems = adults.map(adult => {
        return `
        <item xsi:type="tns:InputReqNameArray">
          <FirstName xsi:type="xsd:string">${adult.firstName.toUpperCase()}</FirstName>
          <LastName xsi:type="xsd:string">${adult.lastName.toUpperCase()}</LastName>
          <Suffix xsi:type="xsd:string">${adult.salutation}</Suffix>
          <Dob xsi:type="xsd:string">-</Dob>
          <IdNo xsi:type="xsd:string">${adult.passportNumber}</IdNo>
          <Passport xsi:type="urn:PassportArray" soapenc:arrayType="urn:InputPassportArray[1]">
            <item xsi:type="tns:InputPassportArray">
              <PassportNumber xsi:type="xsd:string">${adult.passportNumber}</PassportNumber>
              <ExpiryDate xsi:type="xsd:string">${format(new Date(adult.passportExpiry), 'dd-MMM-yy')}</ExpiryDate>
              <IssuingCountry xsi:type="xsd:string">${adult.country || '?'}</IssuingCountry>
              <IssuingDate xsi:type="xsd:string">?</IssuingDate>
            </item>
          </Passport>
        </item>`;
      }).join('');
      
      adultNames = `<AdultNames xsi:type="urn:AdultNamesArray" soapenc:arrayType="urn:InputReqNameArray[${adults.length}]">
        ${adultItems}
      </AdultNames>`;
    } else {
      adultNames = `<AdultNames xsi:type="urn:AdultNamesArray" soapenc:arrayType="urn:InputReqNameArray[0]"></AdultNames>`;
    }
    
    // Then handle the Child array
    let childNames = '';
    if (children.length > 0) {
      const childItems = children.map(child => {
        return `
        <item xsi:type="tns:InputReqNameArray">
          <FirstName xsi:type="xsd:string">${child.firstName.toUpperCase()}</FirstName>
          <LastName xsi:type="xsd:string">${child.lastName.toUpperCase()}</LastName>
          <Suffix xsi:type="xsd:string">${child.salutation}</Suffix>
          <Dob xsi:type="xsd:string">${format(new Date(child.dateOfBirth), 'yyyy-MM-dd')}</Dob>
          <IdNo xsi:type="xsd:string">${child.passportNumber}</IdNo>
          <Passport xsi:type="urn:PassportArray" soapenc:arrayType="urn:InputPassportArray[1]">
            <item xsi:type="tns:InputPassportArray">
              <PassportNumber xsi:type="xsd:string">${child.passportNumber}</PassportNumber>
              <ExpiryDate xsi:type="xsd:string">${format(new Date(child.passportExpiry), 'dd-MMM-yy')}</ExpiryDate>
              <IssuingCountry xsi:type="xsd:string">${child.country || '?'}</IssuingCountry>
              <IssuingDate xsi:type="xsd:string">?</IssuingDate>
            </item>
          </Passport>
        </item>`;
      }).join('');
      
      childNames = `<ChildNames xsi:type="urn:ChildNamesArray" soapenc:arrayType="urn:InputReqNameArray[${children.length}]">
        ${childItems}
      </ChildNames>`;
    } else {
      childNames = `<ChildNames xsi:type="urn:ChildNamesArray" soapenc:arrayType="urn:InputReqNameArray[0]"></ChildNames>`;
    }
    
    // Then handle the Infant array
    let infantNames = '';
    if (infants.length > 0) {
      const infantItems = infants.map((infant, index) => {
        return `
        <item xsi:type="tns:InputReqArrayInf">
          <FirstName xsi:type="xsd:string">${infant.firstName.toUpperCase()}</FirstName>
          <LastName xsi:type="xsd:string">${infant.lastName.toUpperCase()}</LastName>
          <Dob xsi:type="xsd:string">${format(new Date(infant.dateOfBirth), 'yyyy-MM-dd')}</Dob>
          <AdultRefference xsi:type="xsd:string">${index + 1}</AdultRefference>
          <Passport xsi:type="urn:PassportArray" soapenc:arrayType="urn:InputPassportArray[1]">
            <item xsi:type="tns:InputPassportArray">
              <PassportNumber xsi:type="xsd:string">${infant.passportNumber}</PassportNumber>
              <ExpiryDate xsi:type="xsd:string">${format(new Date(infant.passportExpiry), 'dd-MMM-yy')}</ExpiryDate>
              <IssuingCountry xsi:type="xsd:string">${infant.country || '?'}</IssuingCountry>
              <IssuingDate xsi:type="xsd:string">?</IssuingDate>
            </item>
          </Passport>
        </item>`;
      }).join('');
      
      infantNames = `<InfantNames xsi:type="urn:InfantNamesArray" soapenc:arrayType="urn:InputReqArrayInf[${infants.length}]">
        ${infantItems}
      </InfantNames>`;
    } else {
      infantNames = `<InfantNames xsi:type="urn:InfantNamesArray" soapenc:arrayType="urn:InputReqArrayInf[0]"></InfantNames>`;
    }
    
    // Handle Keys array
    let keys = '';
    if (returnFlight && returnFlight.classKey) {
      keys = `<Keys xsi:type="urn:InputReqArrayKey" soapenc:arrayType="urn:InputReqArrayKeys[2]">
        <item xsi:type="tns:InputReqArrayKeys">
          <Key xsi:type="xsd:string">${flight.classKey}</Key>
          <Category xsi:type="xsd:string">Departure</Category>
        </item>
        <item xsi:type="tns:InputReqArrayKeys">
          <Key xsi:type="xsd:string">${returnFlight.classKey}</Key>
          <Category xsi:type="xsd:string">Return</Category>
        </item>
      </Keys>`;
    } else {
      keys = `<Keys xsi:type="urn:InputReqArrayKey" soapenc:arrayType="urn:InputReqArrayKeys[1]">
        <item xsi:type="tns:InputReqArrayKeys">
          <Key xsi:type="xsd:string">${flight.classKey}</Key>
          <Category xsi:type="xsd:string">Departure</Category>
        </item>
      </Keys>`;
    }
    
    // Create the complete SOAP envelope
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
        <Username xsi:type="xsd:string">DILTRAVEL002</Username>
        <Password xsi:type="xsd:string">Abc12345</Password>
        <Received xsi:type="xsd:string">AGENT</Received>
        <ReceivedPhone xsi:type="xsd:string">${contactDetails.phone || '01234562'}</ReceivedPhone>
        <Email xsi:type="xsd:string">${contactDetails.email.toUpperCase()}</Email>
        <SearchKey xsi:type="xsd:string">${flight.searchKey}</SearchKey>
        <ExtraCoverAddOns xsi:type="xsd:string">?</ExtraCoverAddOns>
        ${adultNames}
        ${childNames}
        ${infantNames}
        ${keys}
      </param>
    </urn:WsGeneratePNR>
  </soapenv:Body>
</soapenv:Envelope>`;
  }
}