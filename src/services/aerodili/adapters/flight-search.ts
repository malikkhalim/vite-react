import { format } from 'date-fns';
import { SoapClient } from '../client/soap-client';
import type { BookingFormData, Flight, FlightClass } from '../../../types/flight';
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
      
      // Process outbound flights
      const outboundTripDetail = response.data.TripDetail?.find(
        (trip: any) => trip.Category === 'Departure'
      );
      
      const outboundFlights = outboundTripDetail ? this.processTripDetail(outboundTripDetail, searchKey) : [];
      
      // Process return flights if needed
      let returnFlights: Flight[] = [];
      if (formData.tripType === 'return') {
        const returnTripDetail = response.data.TripDetail?.find(
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
      if (!route.Segments || !route.Segments.length || !route.ClassesAvailable || !route.ClassesAvailable.length) {
        return null;
      }
      
      // Find available class options
      const classOptions = route.ClassesAvailable.filter(
        (classOption: any) => classOption.SeatAvail === 'OPEN'
      );
      
      if (classOptions.length === 0) {
        return null;
      }
      
      // Prioritize economy and business class options
      const economyClass = classOptions.find(
        (option: any) => ['Q', 'V', 'M', 'L', 'K', 'T', 'N'].includes(option.Class)
      ) || classOptions[0];
      
      const businessClass = classOptions.find(
        (option: any) => ['Y', 'S', 'C'].includes(option.Class)
      ) || classOptions[classOptions.length - 1];
      
      // Extract flight details
      const segment = route.Segments[0];
      const flightId = `${segment.CarrierCode}${segment.NoFlight}`;
      
      // Parse dates
      const departureDate = this.parseDate(route.Std);
      const arrivalDate = this.parseDate(route.Sta);
      
      // Calculate duration in minutes
      const duration = route.FlightTime ? parseInt(route.FlightTime, 10) : 
        this.calculateDuration(departureDate, arrivalDate);
      
      // Extract baggage information
      const baggageInfo = this.extractBaggageInfo(segment.FBag || []);
      
      return {
        id: flightId,
        from: route.CityFrom as AirportCode,
        to: route.CityTo as AirportCode,
        departureDate: departureDate.toISOString(),
        arrivalDate: arrivalDate.toISOString(),
        duration: duration,
        aircraft: segment.Aircraft || `${segment.CarrierCode} ${segment.NoFlight}`,
        
        // Pricing details
        price: this.extractPrice(economyClass),
        businessPrice: this.extractPrice(businessClass),
        
        // Seat availability
        seatsAvailable: parseInt(economyClass.Availability || '0', 10),
        businessSeatsAvailable: parseInt(businessClass.Availability || '0', 10),
        
        // Baggage information
        baggage: {
          economy: baggageInfo.economy || 20,
          business: baggageInfo.business || 30
        },
        
        // Service information
        services: {
          economy: [
            'Complimentary snacks and beverages',
            'In-flight entertainment',
            'Free baggage allowance'
          ],
          business: [
            'Priority boarding',
            'Premium meals and beverages',
            'Extra legroom',
            'Priority baggage handling'
          ]
        },
        
        // Search and booking details
        searchKey: searchKey,
        classKey: economyClass.Key || ''
      };
    }).filter(Boolean) as Flight[];
  }
  
  private static parseDate(dateString: string): Date {
    try {
      // Format: "06-MAR-25 07.00.00 PM"
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('-');
      
      // Parse time in 12-hour format with AM/PM
      const [hourMin, ampm] = timePart.split(' ');
      let [hours, minutes] = hourMin.split('.');
      
      // Convert to 24-hour format
      let hour = parseInt(hours, 10);
      if (ampm === 'PM' && hour < 12) hour += 12;
      if (ampm === 'AM' && hour === 12) hour = 0;
      
      // Map month abbreviation to month number
      const months: Record<string, number> = {
        'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
        'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
      };
      
      return new Date(
        parseInt(`20${year}`, 10),
        months[month],
        parseInt(day, 10),
        hour,
        parseInt(minutes, 10)
      );
    } catch (e) {
      console.error('Error parsing date:', dateString, e);
      return new Date();
    }
  }
  
  private static calculateDuration(departure: Date, arrival: Date): number {
    return Math.round((arrival.getTime() - departure.getTime()) / (1000 * 60));
  }
  
  private static extractBaggageInfo(fBagItems: any[]): { economy: number, business: number } {
    const result = { economy: 20, business: 30 };
    
    if (!fBagItems || !fBagItems.length) return result;
    
    // Economy class typical codes: Q, V, T, M, N, K, L
    // Business class typical codes: Y, S, C, D, I
    
    // Find economy class baggage
    const economyBag = fBagItems.find(bag => 
      ['Q', 'V', 'T', 'M', 'N', 'K', 'L'].includes(bag.Class)
    );
    
    // Find business class baggage
    const businessBag = fBagItems.find(bag => 
      ['Y', 'S', 'C', 'D', 'I'].includes(bag.Class)
    );
    
    if (economyBag && economyBag.Amount) {
      result.economy = parseInt(economyBag.Amount.replace('Kg', ''), 10);
    }
    
    if (businessBag && businessBag.Amount) {
      result.business = parseInt(businessBag.Amount.replace('Kg', ''), 10);
    }
    
    return result;
  }
  
  private static extractPrice(classOption: any): number {
    if (!classOption) return 0;
    
    // If Price is directly available
    if (classOption.Price) {
      return parseFloat(classOption.Price);
    }
    
    // Try to extract from price details
    if (classOption.PriceDetail && classOption.PriceDetail.length > 0) {
      const adultPrice = classOption.PriceDetail.find(
        (detail: any) => detail.PaxCategory === 'ADT'
      );
      
      if (adultPrice && adultPrice.Total_1) {
        return parseFloat(adultPrice.Total_1);
      }
      
      // Try to extract from fare components
      if (adultPrice && adultPrice.FareComponent && adultPrice.FareComponent.length > 0) {
        const basicFare = adultPrice.FareComponent.find(
          (component: any) => component.FareChargeTypeCode === 'BF'
        );
        
        if (basicFare && basicFare.Amount) {
          return parseFloat(basicFare.Amount);
        }
      }
    }
    
    return 0;
  }
}