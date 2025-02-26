import { format, parse } from 'date-fns';
import type { RetrievePNRResponse, BookingDetails } from '../types/retrieve-pnr';

export class RetrievePNRTransformer {
  static transformResponse(response: RetrievePNRResponse): BookingDetails {
    const { YourItineraryDetails: details } = response;

    return {
      bookingCode: response.BookingCode,
      status: details.ReservationDetails.Status,
      bookingDate: this.formatDateTime(details.ReservationDetails.BookingDate),
      totalAmount: parseFloat(details.PaymentDetails.Total),
      currency: details.PaymentDetails.CurrencyCode,
      passengers: this.transformPassengers(details.PassengerDetails),
      flights: this.transformFlights(details.ItineraryDetails.Journey),
      contact: this.transformContactInfo(details.ContactList)
    };
  }

  private static transformPassengers(passengers: RetrievePNRResponse['YourItineraryDetails']['PassengerDetails']) {
    return passengers.map(passenger => ({
      name: `${passenger.Suffix} ${passenger.FirstName} ${passenger.LastName}`.trim(),
      ticketNumber: passenger.TicketNumber,
      passport: passenger.TravelDoc.find(doc => doc.DocType === 'PASSPORT')?.DocNumber || ''
    }));
  }

  private static transformFlights(journeys: RetrievePNRResponse['YourItineraryDetails']['ItineraryDetails']['Journey']) {
    return journeys.flatMap(journey => 
      journey.Segment.map(segment => ({
        flightNumber: segment.FlightNo,
        from: `${segment.CityFromName} (${segment.CityFrom})`,
        to: `${segment.CityToName} (${segment.CityTo})`,
        departureTime: this.formatFlightTime(segment.StdLT),
        arrivalTime: this.formatFlightTime(segment.StaLT),
        class: segment.Class,
        status: segment.ReservationStatus
      }))
    );
  }

  private static transformContactInfo(contacts: RetrievePNRResponse['YourItineraryDetails']['ContactList']) {
    const phone = contacts.find(c => c.Type === 'Phone')?.Value || '';
    const email = contacts.find(c => c.Type === 'Email')?.Value || '';
    return { phone, email };
  }

  private static formatDateTime(dateTimeStr: string): string {
    // Input format: "13 Dec 2022 09:38 (GMT+7)"
    const [date, time] = dateTimeStr.split(' (')[0].split(' ');
    const parsedDate = parse(`${date} ${time}`, 'dd MMM yyyy HH:mm', new Date());
    return format(parsedDate, 'yyyy-MM-dd HH:mm:ss');
  }

  private static formatFlightTime(timeStr: string): string {
    // Input format: "10:00 LT"
    return timeStr.replace(' LT', '');
  }
}