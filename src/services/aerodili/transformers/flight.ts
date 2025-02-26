import { format } from 'date-fns';
import { AERODILI_CONFIG } from '../config';
import type { 
  FlightSearchRequest, 
  FlightSearchResponse,
  TransformedFlightResponse,
  TransformedFlight
} from '../types/flight';

export function transformSearchRequest(params: FlightSearchRequest) {
  return {
    Username: AERODILI_CONFIG.USERNAME,
    Password: AERODILI_CONFIG.PASSWORD,
    ReturnStatus: params.returnDate ? "YES" : "NO",
    CityFrom: params.from,
    CityTo: params.to,
    DepartDate: format(new Date(params.date), 'dd-MMM-yy'),
    ReturnDate: params.returnDate ? format(new Date(params.returnDate), 'dd-MMM-yy') : "",
    Adult: params.passengers.adult.toString(),
    Child: params.passengers.child.toString(),
    Infant: params.passengers.infant.toString()
  };
}

export function transformSearchResponse(response: any): TransformedFlightResponse {
  if (!response?.TripDetail?.length) {
    return { flights: [] };
  }

  const transformedFlights: TransformedFlight[] = [];

  response.TripDetail.forEach((trip: any) => {
    if (trip.FlightRoute) {
      trip.FlightRoute.forEach((route: any) => {
        if (route.Segments) {
          route.Segments.forEach((segment: any) => {
            transformedFlights.push({
              flightNumber: `${segment.CarrierCode}${segment.NoFlight}`,
              from: segment.DepartureStation,
              to: segment.ArrivalStation,
              departureTime: route.Std,
              arrivalTime: route.Sta,
              price: parseFloat(segment.Price) || 0,
              currency: segment.Currency || 'USD',
              status: segment.StatusAvail || 'Unknown'
            });
          });
        }
      });
    }
  });

  return { flights: transformedFlights };
}