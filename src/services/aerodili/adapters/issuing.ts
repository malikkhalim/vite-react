import { SoapClient } from '../client/soap-client';
import { SOAP_ENDPOINTS } from '../config/endpoints';

export class IssuingAdapter {
  static async issueTicket(bookingCode: string) {
    const requestData = {
      Username: 'DILTRAVEL002',
      Password: 'Abc12345',
      BookingCode: bookingCode
    };

    const response = await SoapClient.execute(
      SOAP_ENDPOINTS.ISSUING,
      requestData
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Ticket issuance failed');
    }

    const passengerTickets = response.data.YourItineraryDetails.PassengerDetails.map((passenger: any) => ({
      name: `${passenger.Suffix} ${passenger.FirstName} ${passenger.LastName}`,
      ticketNumber: passenger.TicketNumber
    }));

    return {
      success: true,
      bookingCode: response.data.BookingCode,
      status: response.data.YourItineraryDetails.ReservationDetails.Status,
      passengers: passengerTickets
    };
  }
}