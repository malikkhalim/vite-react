import type { IssuingResponse, IssuingResult } from '../types/issuing';

export class IssuingTransformer {
  static transformResponse(soapResponse: any): IssuingResult {
    try {
      const response = this.extractResponse(soapResponse);
      
      if (response.ErrorCode !== 'ISSUED0000' || response.ErrorMessage !== 'Success.') {
        return {
          success: false,
          error: {
            code: response.ErrorCode,
            message: response.ErrorMessage
          }
        };
      }

      const { YourItineraryDetails: details } = response;
      const passengers = details.PassengerDetails.map(passenger => ({
        name: `${passenger.FirstName} ${passenger.LastName}`,
        ticketNumber: passenger.TicketNumber
      }));

      return {
        success: true,
        bookingCode: response.BookingCode,
        status: details.ReservationDetails.Status,
        passengers
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'PARSE_ERROR',
          message: 'Failed to parse issuing response'
        }
      };
    }
  }

  private static extractResponse(soapResponse: any): IssuingResponse {
    return soapResponse['SOAP-ENV:Envelope']['SOAP-ENV:Body']
      ['ns1:WsIssuingResponse'].return;
  }
}