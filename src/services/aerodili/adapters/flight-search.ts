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
      // Find a valid class option
      const classOptions = route.ClassesAvailable[0].filter(
        (classOption: any) => classOption.SeatAvail === 'OPEN'
      );
      
      // Function to calculate total price from fare components
      const calculateTotalPrice = (priceDetail: any) => {
        if (!priceDetail || priceDetail.length === 0) return 0;
        
        const adultPriceDetail = priceDetail.find(
          (detail: any) => detail.PaxCategory === 'ADT'
        );
        
        if (!adultPriceDetail) return 0;
        
        // Sum basic fare and PSC fee, subtract agent discounts
        const basicFare = parseFloat(
          adultPriceDetail.FareComponent.find(
            (comp: any) => comp.FareChargeTypeCode === 'BF'
          )?.Amount || '0'
        );
        
        const pscFee = parseFloat(
          adultPriceDetail.FareComponent.find(
            (comp: any) => comp.FareChargeTypeCode === 'PSC'
          )?.Amount || '0'
        );
        
        const agentDiscount = Math.abs(parseFloat(
          adultPriceDetail.FareComponent.find(
            (comp: any) => comp.FareChargeTypeCode === 'AC'
          )?.Amount || '0'
        ));
        
        return basicFare + pscFee - agentDiscount;
      };
      
      // Find economy and business class options
      const economyClasses = classOptions.filter(
        (option: any) => ['Q', 'V', 'T', 'M', 'N', 'K', 'L', 'W', 'S'].includes(option.Class)
      );
      
      const businessClasses = classOptions.filter(
        (option: any) => ['Y', 'C', 'I', 'D'].includes(option.Class)
      );
      
      const lowestEconomyClass = economyClasses.length > 0 
        ? economyClasses.reduce((lowest: { Price: string; }, current: { Price: string; }) => 
            parseFloat(lowest.Price) < parseFloat(current.Price) ? lowest : current
          )
        : null;
      
      const lowestBusinessClass = businessClasses.length > 0
        ? businessClasses.reduce((lowest: { Price: string; }, current: { Price: string; }) => 
            parseFloat(lowest.Price) < parseFloat(current.Price) ? lowest : current
          )
        : null;
      
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
        aircraft: segment.Aircraft || '8G 737',
        price: lowestEconomyClass 
          ? calculateTotalPrice(lowestEconomyClass.PriceDetail) 
          : 0,
        businessPrice: lowestBusinessClass
          ? calculateTotalPrice(lowestBusinessClass.PriceDetail)
          : 0,
        seatsAvailable: lowestEconomyClass 
          ? parseInt(lowestEconomyClass.Availability, 10) 
          : 0,
        businessSeatsAvailable: lowestBusinessClass
          ? parseInt(lowestBusinessClass.Availability, 10)
          : 0,
        baggage: {
          economy: 25,  // Default from segment details
          business: 35
        },
        services: {
          economy: ['Complimentary snacks', 'In-flight entertainment'],
          business: ['Priority boarding', 'Premium meals', 'Extra legroom']
        },
        searchKey: searchKey,
        classKey: lowestEconomyClass ? lowestEconomyClass.Key : ''
      };
    });
  }
}