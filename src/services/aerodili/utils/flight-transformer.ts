import { format, parse } from 'date-fns';
import type { FlightRoute, TripDetail } from '../types/flight-search';
import type { Flight } from '../../../types/flight';

export class FlightTransformer {
  static toFlightModel(tripDetail: TripDetail): Flight[] {
    return tripDetail.FlightRoute.map(route => {
      const segment = route.Segments[0];
      const classInfo = route.ClassesAvailable[0];
      
      return {
        id: `${segment.CarrierCode}${segment.NoFlight}`,
        from: route.CityFrom,
        to: route.CityTo,
        departureDate: this.parseDateTime(route.Std),
        arrivalDate: this.parseDateTime(route.Sta),
        duration: this.calculateDuration(route.Std, route.Sta),
        aircraft: `${segment.CarrierCode} ${segment.NoFlight}`,
        price: parseFloat(classInfo.Price),
        businessPrice: parseFloat(classInfo.Price) * 2,
        seatsAvailable: parseInt(classInfo.Availability),
        businessSeatsAvailable: Math.floor(parseInt(classInfo.Availability) / 2),
        baggage: {
          economy: 20,
          business: 30
        },
        services: {
          economy: ['Standard seat selection', 'Complimentary meals'],
          business: ['Priority boarding', 'Lounge access', 'Premium meals']
        },
        searchKey: tripDetail.SearchKey || '',
        classKey: classInfo.Key || ''
      };
    });
  }

  private static parseDateTime(dateTimeStr: string): string {
    const date = parse(dateTimeStr, 'dd-MMM-yy hh.mm.ss a', new Date());
    return date.toISOString();
  }

  private static calculateDuration(std: string, sta: string): number {
    const departure = parse(std, 'dd-MMM-yy hh.mm.ss a', new Date());
    const arrival = parse(sta, 'dd-MMM-yy hh.mm.ss a', new Date());
    return Math.round((arrival.getTime() - departure.getTime()) / (1000 * 60));
  }
}