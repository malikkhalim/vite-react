import { format } from 'date-fns';
import { SoapClient } from '../client/soap-client';
import type { BookingFormData, Flight } from '../../../types/flight';
import { routes } from '../../../data/flights/routes';

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
      // Find available class options
      const classOptions = route.ClassesAvailable[0].filter(
        (classOption: any) => classOption.SeatAvail === 'OPEN'
      );
      
      // Prioritize economy and business class options
      const economyClass = classOptions.find(
        (option: any) => ['X', 'V', 'M', 'L', 'K', 'Q', 'T', 'N'].includes(option.Class)
      ) || classOptions[0];
      
      const businessClass = classOptions.find(
        (option: any) => ['Y', 'S', 'C'].includes(option.Class)
      ) || classOptions[classOptions.length - 1];
      
      // Extract flight details
      const segment = route.Segments[0];
      const flightId = `${segment.CarrierCode}${segment.NoFlight}`;
      
      // Extract baggage information
      const extractBaggageInfo = (fBag: any[]) => {
        const baggageInfo: {[key: string]: number} = {};
        fBag.forEach(bag => {
          baggageInfo[bag.Class] = parseInt(bag.Amount.replace('Kg', ''), 10);
        });
        return baggageInfo;
      };
      
      // Detailed price calculation
      const calculateDetailedPrice = (priceDetail: any) => {
        if (!priceDetail || !priceDetail.item) return 0;
        
        const adultPriceDetail = priceDetail.item.find(
          (detail: any) => detail.PaxCategory === 'ADT'
        );
        
        if (!adultPriceDetail) return 0;
        
        // Sum up relevant fare components
        const basicFare = parseFloat(
          adultPriceDetail.FareComponent.find(
            (component: any) => component.FareChargeTypeCode === 'BF'
          )?.Amount || '0'
        );
        
        const pscFee = parseFloat(
          adultPriceDetail.FareComponent.find(
            (component: any) => component.FareChargeTypeCode === 'PSC'
          )?.Amount || '0'
        );
        
        return basicFare + pscFee;
      };
      
      return {
        id: flightId,
        from: route.CityFrom,
        to: route.CityTo,
        departureDate: route.Std,
        arrivalDate: route.Sta,
        flightNumber: `${segment.CarrierCode}${segment.NoFlight}`,
        carrier: segment.CarrierCode,
        duration: parseInt(route.FlightTime || '120', 10),
        aircraft: segment.Aircraft || 'Airbus A320',
        
        // Pricing details
        price: calculateDetailedPrice(economyClass?.PriceDetail),
        priceDetails: {
          total: parseFloat(economyClass?.Price || '0'),
          basicFare: calculateDetailedPrice(economyClass?.PriceDetail),
          currency: economyClass?.Currency || 'USD'
        },
        
        businessPrice: calculateDetailedPrice(businessClass?.PriceDetail),
        businessPriceDetails: {
          total: parseFloat(businessClass?.Price || '0'),
          basicFare: calculateDetailedPrice(businessClass?.PriceDetail),
          currency: businessClass?.Currency || 'USD'
        },
        
        // Seat availability
        seatsAvailable: parseInt(economyClass?.Availability || '0', 10),
        businessSeatsAvailable: parseInt(businessClass?.Availability || '0', 10),
        
        // Baggage information
        baggage: {
          economy: extractBaggageInfo(segment.FBag || [])
        },
        
        // Additional flight details
        departureStation: segment.DepartureStation,
        arrivalStation: segment.ArrivalStation,
        
        // Search and booking details
        searchKey: searchKey,
        classKey: economyClass?.Key || '',
        seatAvailabilityStatus: {
          economy: economyClass?.SeatAvail || 'CLOSE',
          business: businessClass?.SeatAvail || 'CLOSE'
        },
        
        // Additional metadata
        classAvailable: classOptions.map(option => ({
          class: option.Class,
          availability: option.Availability,
          seatAvail: option.SeatAvail,
          price: option.Price
        }))
      };
    });
  }
}