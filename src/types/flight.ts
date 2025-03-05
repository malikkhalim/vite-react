import { AirportCode } from "./airport";

export interface Flight {
  id: string;
  from: AirportCode;
  to: AirportCode;
  departureDate: string;
  arrivalDate: string;
  duration: number;
  aircraft: string;
  price: number;
  businessPrice: number;
  seatsAvailable: number;
  businessSeatsAvailable: number;
  baggage: {
    economy: number;
    business: number;
  };
  services: {
    economy: string[];
    business: string[];
  };
  searchKey: string; 
  classKey: string;
}

export type FlightClass = 'economy' | 'business';
export type TripType = 'one-way' | 'return';
export type PassengerType = 'adult' | 'child' | 'infant';

export interface PassengerCount {
  adult: number;
  child: number;
  infant: number;
}

export interface BookingFormData {
  outboundFlights: boolean;
  from: AirportCode;
  to: AirportCode;
  departureDate: string;
  returnDate?: string;
  passengers: PassengerCount;
  class: FlightClass;
  tripType: TripType;
}