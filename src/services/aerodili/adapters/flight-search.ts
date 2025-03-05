import { format } from 'date-fns';
import { SoapClient } from '../client/soap-client';
import type { BookingFormData, Flight } from '../../../types/flight';
import type { AirportCode } from '../../../types/airport';

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
      let outboundFlights: Flight[] = [];
      let returnFlights: Flight[] = [];
      
      // Extract TripDetail data
      if (response.data.TripDetail && Array.isArray(response.data.TripDetail)) {
        // Process outbound flights
        const outboundTripDetail = response.data.TripDetail.find(
          (trip: any) => trip.Category === 'Departure'
        );
        
        if (outboundTripDetail && outboundTripDetail.FlightRoute) {
          outboundFlights = this.processFlightRoutes(outboundTripDetail.FlightRoute, searchKey);
        }
        
        // Process return flights if needed
        if (formData.tripType === 'return') {
          const returnTripDetail = response.data.TripDetail.find(
            (trip: any) => trip.Category === 'Return'
          );
          
          if (returnTripDetail && returnTripDetail.FlightRoute) {
            returnFlights = this.processFlightRoutes(returnTripDetail.FlightRoute, searchKey);
          }
        }
      }
      
      console.log("Processed flights:", { outboundFlights, returnFlights });
      
      return {
        outboundFlights,
        returnFlights
      };
    } catch (error) {
      console.error("Flight search error:", error);
      throw error;
    }
  }

  private static processFlightRoutes(routes: any[], searchKey: string): Flight[] {
    if (!routes || !Array.isArray(routes)) {
      console.log("No routes or not an array:", routes);
      return [];
    }
    
    return routes.map(route => {
      try {
        // Check if we have segments data
        if (!route.Segments || !Array.isArray(route.Segments) || route.Segments.length === 0) {
          console.log("Missing segments data for route:", route);
          return null;
        }
        
        const segment = route.Segments[0];
        
        // Check if we have class availability data
        if (!route.ClassesAvailable || !Array.isArray(route.ClassesAvailable) || route.ClassesAvailable.length === 0) {
          console.log("Missing class availability data for route:", route);
          return null;
        }
        
        // Find available classes
        const availableClasses = route.ClassesAvailable.filter((c: any) => c.SeatAvail === 'OPEN');
        
        if (availableClasses.length === 0) {
          console.log("No available classes for route:", route);
          return null;
        }
        
        // Get economy and business class options
        const economy = availableClasses.find((c: any) => ['Q', 'V', 'T', 'M', 'N', 'K', 'L'].includes(c.Class)) || availableClasses[0];
        const business = availableClasses.find((c: any) => ['Y', 'J', 'C', 'D', 'I'].includes(c.Class)) || availableClasses[availableClasses.length - 1];
        
        // Get flight ID
        const flightId = `${segment.CarrierCode}${segment.NoFlight}`;
        
        // Extract baggage allowance
        const baggage = {
          economy: 20,  // Default value
          business: 30  // Default value
        };
        
        // If segment has baggage info, extract it
        if (segment.FBag && Array.isArray(segment.FBag)) {
          const economyBag = segment.FBag.find((b: any) => ['Q', 'V', 'T', 'M', 'N', 'K', 'L'].includes(b.Class));
          const businessBag = segment.FBag.find((b: any) => ['Y', 'J', 'C', 'D', 'I'].includes(b.Class));
          
          if (economyBag && economyBag.Amount) {
            baggage.economy = parseInt(economyBag.Amount.replace('Kg', ''), 10) || baggage.economy;
          }
          
          if (businessBag && businessBag.Amount) {
            baggage.business = parseInt(businessBag.Amount.replace('Kg', ''), 10) || baggage.business;
          }
        }
        
        // Parse dates
        const departureDate = new Date(route.Std);
        const arrivalDate = new Date(route.Sta);
        
        return {
          id: flightId,
          from: route.CityFrom as AirportCode,
          to: route.CityTo as AirportCode,
          departureDate: departureDate.toISOString(),
          arrivalDate: arrivalDate.toISOString(),
          duration: route.FlightTime ? parseInt(route.FlightTime, 10) : 0,
          aircraft: segment.Aircraft || `${segment.CarrierCode} ${segment.NoFlight}`,
          price: economy ? parseFloat(economy.Price) || 0 : 0,
          businessPrice: business ? parseFloat(business.Price) || 0 : 0,
          seatsAvailable: economy ? parseInt(economy.Availability, 10) || 0 : 0,
          businessSeatsAvailable: business ? parseInt(business.Availability, 10) || 0 : 0,
          baggage,
          services: {
            economy: [
              'Complimentary snacks and beverages',
              'Free baggage allowance'
            ],
            business: [
              'Priority boarding',
              'Premium meals and beverages',
              'Extra legroom',
              'Priority baggage handling'
            ]
          },
          searchKey,
          classKey: economy ? economy.Key : ''
        };
      } catch (err) {
        console.error("Error processing flight route:", err, route);
        return null;
      }
    }).filter(Boolean) as Flight[];
  }
}