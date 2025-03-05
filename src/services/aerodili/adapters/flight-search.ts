import { format } from 'date-fns';
import { SoapClient } from '../client/soap-client';
import { SOAP_ENDPOINTS } from '../config/endpoints';
import type { BookingFormData, Flight } from '../../../types/flight';

export class FlightSearchAdapter {
  static async searchFlights(formData: BookingFormData) {
    const requestData = {
      Username: 'DILTRAVEL002',
      Password: 'Abc12345',
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

    const response = await SoapClient.execute(
      SOAP_ENDPOINTS.FLIGHT_SEARCH,
      requestData
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'Search failed');
    }

    // Extract the SearchKey from response for later use in PNR generation
    const searchKey = response.data.SearchKey;

    // Transform the TripDetail into Flight objects
    const outboundFlights = this.transformFlights(
      response.data.TripDetail.find(trip => trip.Category === 'Departure'),
      searchKey
    );
    
    const returnFlights = formData.tripType === 'return' 
      ? this.transformFlights(
          response.data.TripDetail.find(trip => trip.Category === 'Return'),
          searchKey
        )
      : [];

    return {
      outboundFlights,
      returnFlights
    };
  }

  private static transformFlights(tripDetail: any, searchKey: string): Flight[] {
    if (!tripDetail || !tripDetail.FlightRoute) return [];

    return tripDetail.FlightRoute.map(route => {
      // Find the available class with the best price
      const availableClasses = route.ClassesAvailable[0].filter(
        (c: any) => c.SeatAvail === 'OPEN'
      );
      
      const economyClass = availableClasses.find((c: any) => 
        ['X', 'V', 'M', 'L', 'K'].includes(c.Class)
      );
      
      const businessClass = availableClasses.find((c: any) => 
        ['Y', 'W', 'S', 'H'].includes(c.Class)
      );

      return {
        id: `${route.Segments[0].CarrierCode}${route.Segments[0].NoFlight}`,
        from: route.CityFrom,
        to: route.CityTo,
        departureDate: route.Std,
        arrivalDate: route.Sta,
        duration: parseInt(route.FlightTime, 10),
        aircraft: 'Airbus A320', // This should come from a mapping based on flight number
        price: economyClass ? parseFloat(economyClass.Price) : 0,
        businessPrice: businessClass ? parseFloat(businessClass.Price) : 0,
        seatsAvailable: economyClass ? parseInt(economyClass.Availability, 10) : 0,
        businessSeatsAvailable: businessClass ? parseInt(businessClass.Availability, 10) : 0,
        baggage: {
          economy: 20, // Default values, should be extracted from API if available
          business: 30
        },
        services: {
          economy: ['Complimentary snacks', 'In-flight entertainment'],
          business: ['Priority boarding', 'Premium meals', 'Extra legroom']
        },
        searchKey: searchKey,
        classKey: economyClass?.Key || ''
      };
    });
  }
}