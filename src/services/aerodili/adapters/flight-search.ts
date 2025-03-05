import { Flight, FlightClass, BookingFormData } from '../../../types/flight';
import { SoapClient } from '../client/soap-client';
import { format, parse } from 'date-fns';

export class FlightSearchAdapter {
  static async searchFlights(formData: BookingFormData) {
    try {
      console.log("Searching flights with data:", formData);
      
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

      console.log("API Response received");
      
      // Extract search key for booking
      const searchKey = response.data.SearchKey["#text"];
      
      // Process outbound flights
      const outboundTripDetail = response.data.TripDetail[0]?.item.find(
        (trip: any) => trip.Category["#text"] === 'Departure'
      );
      
      const outboundFlights = outboundTripDetail 
        ? this.processTripDetail(outboundTripDetail, searchKey)
        : [];
      
      // Process return flights if needed
      let returnFlights: Flight[] = [];
      if (formData.tripType === 'return') {
        const returnTripDetail = response.data.TripDetail[0]?.item.find(
          (trip: any) => trip.Category["#text"] === 'Return'
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
    if (!tripDetail || !tripDetail.FlightRoute) {
      return [];
    }
    
    // Ensure FlightRoute is always treated as an array
    const flightRoutes = Array.isArray(tripDetail.FlightRoute[0].item) 
      ? tripDetail.FlightRoute[0].item 
      : [tripDetail.FlightRoute[0].item];
    
    return flightRoutes.map((route: any) => {
      // Extract segments
      const segments = route.Segments[0].item;
      const segment = Array.isArray(segments) ? segments[0] : segments;
      
      // Extract class availability information
      const classesAvailable = route.ClassesAvailable[0].item[0].item;
      
      // Find economy and business class options
      const economyClasses = classesAvailable.filter(
        (cls: any) => cls.SeatAvail["#text"] === 'OPEN' && 
          ['Q', 'V', 'T', 'M', 'N', 'K', 'L', 'W'].includes(cls.Class["#text"])
      );
      
      const businessClasses = classesAvailable.filter(
        (cls: any) => cls.SeatAvail["#text"] === 'OPEN' && 
          ['S', 'Y', 'C'].includes(cls.Class["#text"])
      );
      
      const economyClass = economyClasses.length > 0 ? economyClasses[0] : null;
      const businessClass = businessClasses.length > 0 ? businessClasses[0] : null;
      
      // Parse dates
      const departureDate = this.parseDateTime(route.Std["#text"]);
      const arrivalDate = this.parseDateTime(route.Sta["#text"]);
      
      // Calculate duration in minutes
      const duration = route.FlightTime ? parseInt(route.FlightTime["#text"], 10) : 0;
      
      // Extract baggage allowance
      const baggageInfo = {
        economy: 25, // Default
        business: 35  // Default
      };
      
      if (segment.FBag && segment.FBag.item) {
        const economyBag = segment.FBag.item.find(
          (bag: any) => ['Q', 'V', 'T', 'M', 'N', 'K'].includes(bag.Class["#text"])
        );
        
        const businessBag = segment.FBag.item.find(
          (bag: any) => ['S', 'Y', 'C'].includes(bag.Class["#text"])
        );
        
        if (economyBag) {
          baggageInfo.economy = parseInt(economyBag.Amount["#text"].replace('Kg', ''), 10);
        }
        
        if (businessBag) {
          baggageInfo.business = parseInt(businessBag.Amount["#text"].replace('Kg', ''), 10);
        }
      }
      
      // Create flight object
      const flightId = `${segment.CarrierCode["#text"]}${segment.NoFlight["#text"]}`;
      
      return {
        id: flightId,
        from: route.CityFrom["#text"],
        to: route.CityTo["#text"],
        departureDate: departureDate.toISOString(),
        arrivalDate: arrivalDate.toISOString(),
        duration: duration,
        aircraft: `${segment.CarrierCode["#text"]} ${segment.NoFlight["#text"]}`,
        price: economyClass ? parseFloat(economyClass.Price["#text"]) : 0,
        businessPrice: businessClass ? parseFloat(businessClass.Price["#text"]) : 0,
        seatsAvailable: economyClass ? parseInt(economyClass.Availability["#text"], 10) : 0,
        businessSeatsAvailable: businessClass ? parseInt(businessClass.Availability["#text"], 10) : 0,
        baggage: baggageInfo,
        services: {
          economy: [
            'Complimentary snacks and beverages',
            'Standard baggage allowance',
            'In-flight entertainment'
          ],
          business: [
            'Priority boarding',
            'Premium meals and beverages',
            'Extra legroom',
            'Increased baggage allowance',
            'Lounge access'
          ]
        },
        searchKey: searchKey,
        classKey: economyClass ? economyClass.Key["#text"] : ''
      };
    });
  }

  private static parseDateTime(dateTimeStr: string): Date {
    // Format: "06-MAR-25 07.00.00 PM"
    try {
      const date = parse(dateTimeStr, 'dd-MMM-yy hh.mm.ss a', new Date());
      return date;
    } catch (error) {
      console.error("Date parsing error:", error, dateTimeStr);
      return new Date(); // Fallback to current date
    }
  }
}