import type { TicketIssuanceResponse } from '../../../types/ticket';

export class IssuingAdapter {
  static async issueTicket(bookingCode: string): Promise<TicketIssuanceResponse> {
    try {
      console.log("Issuing ticket for booking:", bookingCode);
      
      // Create the SOAP envelope for ticket issuance
      const envelope = this.createIssuingEnvelope(bookingCode);
      
      // Send the request via our SOAP proxy
      const response = await fetch('/api/soap-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'WsIssuing',
          envelope
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log("Ticket issuance response:", result);
      
      if (!result.success) {
        throw new Error(result.error?.message || 'Ticket issuance failed');
      }
      
      // Extract data from the response
      const data = result.data;
      
      // Extract key information
      const ticketNumbers = this.extractTicketNumbers(data);
      const status = this.extractValue(data?.YourItineraryDetails?.ReservationDetails?.Status) || 'ticketed';
      
      console.log("Extracted ticket details:", {
        bookingCode,
        status,
        ticketNumbers
      });
      
      return {
        success: true,
        bookingCode,
        status,
        ticketNumbers
      };
    } catch (error) {
      console.error("Ticket issuance error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Ticket issuance failed'
      };
    }
  }
  
  // Helper to extract ticket numbers from the response
  private static extractTicketNumbers(data: any): string[] {
    const ticketNumbers: string[] = [];
    
    if (!data?.YourItineraryDetails?.PassengerDetails) {
      return ticketNumbers;
    }
    
    const passengers = Array.isArray(data.YourItineraryDetails.PassengerDetails) ?
      data.YourItineraryDetails.PassengerDetails :
      [data.YourItineraryDetails.PassengerDetails];
    
    passengers.forEach(passenger => {
      const ticketNumber = this.extractValue(passenger.TicketNumber);
      if (ticketNumber) {
        ticketNumbers.push(ticketNumber);
      }
    });
    
    return ticketNumbers;
  }
  
  // Helper to extract values from complex XML-derived objects
  private static extractValue(field: any): string | null {
    if (!field) return null;
    
    if (typeof field === 'string') return field;
    
    if (field['#text']) return field['#text'];
    
    return null;
  }
  
  // Create the SOAP envelope for ticket issuance
  private static createIssuingEnvelope(bookingCode: string): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
  xmlns:urn="urn:sj_service">
  <soapenv:Header/>
  <soapenv:Body>
    <urn:WsIssuing soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
      <param xsi:type="urn:reqWsIssuing">
        <Username xsi:type="xsd:string">DILTRAVEL002</Username>
        <Password xsi:type="xsd:string">Abc12345</Password>
        <BookingCode xsi:type="xsd:string">${bookingCode}</BookingCode>
      </param>
    </urn:WsIssuing>
  </soapenv:Body>
</soapenv:Envelope>`;
  }
}