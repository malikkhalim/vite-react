import { format } from 'date-fns';
import { SoapClient } from '../client/soap-client';
import type { BookingFormData, Flight } from '../../../types/flight';

export class FlightSearchAdapter {
  static async searchFlights(formData: BookingFormData) {
    try {
      console.log("Search data:", formData);
      
      const requestData = {
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
        'WsSearchFlight',
        requestData
      );

      if (!response.success) {
        throw new Error(response.error?.message || 'Search failed');
      }

      console.log("API Response:", response.data);
      
      const searchKey = response.data.SearchKey;
      
      // Process outbound flights
      const outboundTripDetail = response.data.TripDetail.find(
        (trip: any) => trip.Category === 'Departure'
      );
      
      const outboundFlights = this.processTripDetail(outboundTripDetail, searchKey);
      
      // Process return flights if needed
      let returnFlights: Flight[] = [];
      if (formData.tripType === 'return') {
        const returnTripDetail = response.data.TripDetail.find(
          (trip: any) => trip.Category === 'Return'
        );
        
        if (returnTripDetail) {
          returnFlights = this.processTripDetail(returnTripDetail, searchKey);
        }
      }
      
      return {
        outboundFlights,
        returnFlights
      };
    } catch (error) {
      console.error("Flight search error:", error);
      throw error;
    }
  }

  private static processTripDetail(tripDetail: any, searchKey: string): Flight[] {
    if (!tripDetail || !tripDetail.FlightRoute || !tripDetail.FlightRoute.length) {
      return [];
    }
    
    return tripDetail.FlightRoute.map((route: any) => {
      // Find a valid class option
      const classOptions = route.ClassesAvailable[0].filter(
        (classOption: any) => classOption.SeatAvail === 'OPEN'
      );
      
      // Find economy and business class options
      const economyClass = classOptions.find(
        (option: any) => ['X', 'V', 'M', 'L', 'K'].includes(option.Class)
      ) || classOptions[0];
      
      const businessClass = classOptions.find(
        (option: any) => ['Y', 'W', 'S', 'H'].includes(option.Class)
      ) || classOptions[classOptions.length - 1];
      
      // Extract flight details
      const segment = route.Segments[0];
      const flightId = `${segment.CarrierCode}${segment.NoFlight}`;
      
      return {
        id: flightId,
        from: route.CityFrom,
        to: route.CityTo,
        departureDate: route.Std,
        arrivalDate: route.Sta,
        duration: parseInt(route.FlightTime || '120', 10),
        aircraft: 'Airbus A320', // Default
        price: economyClass ? parseFloat(economyClass.Price) : 0,
        businessPrice: businessClass ? parseFloat(businessClass.Price) : 0,
        seatsAvailable: economyClass ? parseInt(economyClass.Availability, 10) : 0,
        businessSeatsAvailable: businessClass ? parseInt(businessClass.Availability, 10) : 0,
        baggage: {
          economy: 20,
          business: 30
        },
        services: {
          economy: ['Complimentary snacks', 'In-flight entertainment'],
          business: ['Priority boarding', 'Premium meals', 'Extra legroom']
        },
        searchKey: searchKey,
        classKey: economyClass ? economyClass.Key : ''
      };
    });
  }
}