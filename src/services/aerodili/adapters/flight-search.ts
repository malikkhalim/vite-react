
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
      
      // Deep access into the complex nested structure
      if (response.data.TripDetail) {
        const tripDetails = this.getDeepArray(response.data.TripDetail);
        
        console.log("Extracted trip details:", tripDetails);
        
        // Find departure and return details
        const departureTrip = this.findTripByCategory(tripDetails, 'Departure');
        const returnTrip = this.findTripByCategory(tripDetails, 'Return');
        
        console.log("Departure trip:", departureTrip);
        console.log("Return trip:", returnTrip);
        
        // Process flight routes if found
        if (departureTrip && departureTrip.FlightRoute) {
          const routes = this.getDeepArray(departureTrip.FlightRoute);
          outboundFlights = this.processFlightRoutes(routes, searchKey);
        }
        
        if (returnTrip && returnTrip.FlightRoute) {
          const routes = this.getDeepArray(returnTrip.FlightRoute);
          returnFlights = this.processFlightRoutes(routes, searchKey);
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
  
  // Helper to find a trip by category
  private static findTripByCategory(trips: any[], category: string): any {
    for (const trip of trips) {
      if (trip && trip.Category === category) {
        return trip;
      }
    }
    return null;
  }
  
  // Helper to extract arrays from deeply nested structures
  private static getDeepArray(data: any): any[] {
    if (!data) return [];
    
    // If it's already an array of objects (not arrays), return it
    if (Array.isArray(data) && data.length > 0 && !Array.isArray(data[0])) {
      return data;
    }
    
    // If it's an array with nested arrays, flatten one level
    if (Array.isArray(data) && data.length > 0 && Array.isArray(data[0])) {
      return this.getDeepArray(data[0]);
    }
    
    // If it's an object with an 'item' property that is an array
    if (data.item && Array.isArray(data.item)) {
      return this.getDeepArray(data.item);
    }
    
    // If we get here and it's still an array, return it
    if (Array.isArray(data)) {
      return data;
    }
    
    // If it's a single object, wrap it in an array
    return [data];
  }

  private static processFlightRoutes(routes: any[], searchKey: string): Flight[] {
    if (!routes || !Array.isArray(routes) || routes.length === 0) {
      console.log("No routes or empty array:", routes);
      return [];
    }
    
    return routes.map(route => {
      try {
        console.log("Processing route:", route);
        
        // Extract segments
        let segments = route.Segments;
        if (!segments) {
          console.log("No segments found");
          return null;
        }
        
        // Handle different segment structures
        segments = this.getDeepArray(segments);
        
        if (!segments.length) {
          console.log("Empty segments array");
          return null;
        }
        
        const segment = segments[0];
        console.log("Using segment:", segment);
        
        // Extract classes available
        let classes = route.ClassesAvailable;
        if (!classes) {
          console.log("No classes found");
          return null;
        }
        
        // Handle different class structures
        classes = this.getDeepArray(classes);
        
        if (!classes.length) {
          console.log("Empty classes array");
          return null;
        }
        
        // Find available classes
        const availableClasses = classes.filter((c: any) => c.SeatAvail === 'OPEN');
        console.log("Available classes:", availableClasses);
        
        if (availableClasses.length === 0) {
          console.log("No available classes for this route");
          return null;
        }
        
        // Get economy and business class options
        const economy = availableClasses.find((c: any) => 
          ['Q', 'V', 'T', 'M', 'N', 'K', 'L'].includes(c.Class)
        ) || availableClasses[0];
        
        const business = availableClasses.find((c: any) => 
          ['Y', 'J', 'C', 'D', 'I'].includes(c.Class)
        ) || availableClasses[availableClasses.length - 1];
        
        // Get flight ID
        const flightId = `${segment.CarrierCode}${segment.NoFlight}`;
        
        // Extract baggage allowance
        const baggage = {
          economy: 20,  // Default value
          business: 30  // Default value
        };
        
        // If segment has baggage info, extract it
        if (segment.FBag) {
          const fBag = this.getDeepArray(segment.FBag);
          
          const economyBag = fBag.find((b: any) => 
            ['Q', 'V', 'T', 'M', 'N', 'K', 'L'].includes(b.Class)
          );
          
          const businessBag = fBag.find((b: any) => 
            ['Y', 'J', 'C', 'D', 'I'].includes(b.Class)
          );
          
          if (economyBag && economyBag.Amount) {
            baggage.economy = parseInt(String(economyBag.Amount).replace('Kg', ''), 10) || baggage.economy;
          }
          
          if (businessBag && businessBag.Amount) {
            baggage.business = parseInt(String(businessBag.Amount).replace('Kg', ''), 10) || baggage.business;
          }
        }
        
        // Parse dates
        const departureDate = new Date(route.Std);
        const arrivalDate = new Date(route.Sta);
        
        // Calculate duration if not provided
        let duration = route.FlightTime ? parseInt(String(route.FlightTime), 10) : 0;
        if (!duration) {
          duration = Math.round((arrivalDate.getTime() - departureDate.getTime()) / (60 * 1000));
        }
        
        const flight: Flight = {
          id: flightId,
          from: route.CityFrom as AirportCode,
          to: route.CityTo as AirportCode,
          departureDate: departureDate.toISOString(),
          arrivalDate: arrivalDate.toISOString(),
          duration: duration,
          aircraft: segment.Aircraft || `${segment.CarrierCode} ${segment.NoFlight}`,
          price: economy ? parseFloat(String(economy.Price)) || 0 : 0,
          businessPrice: business ? parseFloat(String(business.Price)) || 0 : 0,
          seatsAvailable: economy ? parseInt(String(economy.Availability), 10) || 0 : 0,
          businessSeatsAvailable: business ? parseInt(String(business.Availability), 10) || 0 : 0,
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
        
        console.log("Created flight object:", flight);
        return flight;
      } catch (err) {
        console.error("Error processing flight route:", err, route);
        return null;
      }
    }).filter(Boolean) as Flight[];
  }
}