import { format } from 'date-fns';
import { AUTH_CREDENTIALS } from '../constants';
import type { FlightSearchRequest } from '../types/flight';

export function transformSearchRequest(params: FlightSearchRequest) {
  return {
    Username: AUTH_CREDENTIALS.USERNAME,
    Password: AUTH_CREDENTIALS.PASSWORD,
    ReturnStatus: "NO",
    CityFrom: params.from,
    CityTo: params.to,
    DepartDate: format(new Date(params.date), 'dd-MMM-yy'),
    ReturnDate: "",
    Adult: params.passengers.adult?.toString() || "1",
    Child: params.passengers.child?.toString() || "0", 
    Infant: params.passengers.infant?.toString() || "0"
  };
}

export function transformSearchResponse(soapResponse: any) {
  if (!soapResponse?.Flights) {
    return { flights: [] };
  }

  return {
    flights: Array.isArray(soapResponse.Flights) 
      ? soapResponse.Flights.map(transformFlight)
      : [transformFlight(soapResponse.Flights)]
  };
}

function transformFlight(flight: any) {
  return {
    flightNumber: flight.FlightNumber,
    from: flight.Origin,
    to: flight.Destination,
    departureTime: flight.DepartureTime,
    arrivalTime: flight.ArrivalTime,
    availableSeats: parseInt(flight.AvailableSeats, 10) || 0,
    price: parseFloat(flight.Price) || 0
  };
}