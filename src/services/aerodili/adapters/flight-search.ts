import { format } from 'date-fns';
import { SoapClient } from '../client/soap-client';
import { FlightTransformer } from '../utils/flight-transformer';
import { SOAP_ENDPOINTS } from '../config/endpoints';
import type { BookingFormData } from '../../../types/flight';
import type { FlightSearchRequest } from '../types/flight-search';

export class FlightSearchAdapter {
  static async searchFlights(formData: BookingFormData) {
    const requestData = this.transformRequest(formData);
    const response = await SoapClient.execute(
      SOAP_ENDPOINTS.FLIGHT_SEARCH,
      requestData
    );

    if (!response.success) {
      throw new Error(response.error.message);
    }

    const outboundFlights = response.data.TripDetail
      .filter(trip => trip.Category === 'Departure')
      .flatMap(trip => FlightTransformer.toFlightModel(trip));

    const returnFlights = response.data.TripDetail
      .filter(trip => trip.Category === 'Return')
      .flatMap(trip => FlightTransformer.toFlightModel(trip));

    return {
      outboundFlights,
      returnFlights
    };
  }

  private static transformRequest(formData: BookingFormData): FlightSearchRequest {
    return {
      ReturnStatus: formData.tripType === 'return' ? 'YES' : 'NO',
      CityFrom: formData.from,
      CityTo: formData.to,
      DepartDate: format(new Date(formData.departureDate), 'dd-MMM-yy'),
      ReturnDate: formData.returnDate 
        ? format(new Date(formData.returnDate), 'dd-MMM-yy')
        : '',
      PromoCode: '',
      Adult: formData.passengers.adult.toString(),
      Child: formData.passengers.child.toString(),
      Infant: formData.passengers.infant.toString()
    };
  }
}