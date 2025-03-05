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
  from: AirportCode;
  to: AirportCode;
  departureDate: string;
  returnDate?: string;
  passengers: PassengerCount;
  class: FlightClass;
  tripType: TripType;
  outboundFlights?: Flight[];
  returnFlights?: Flight[];
}

export interface PassengerTypeInfo {
  type: PassengerType;
  label: string;
  ageRange: string;
  description: string;
  minPerBooking?: number;
  maxPerBooking?: number;
}

export interface Aircraft {
  type: string;
  code: string;
  capacity: {
    economy: number;
    business: number;
  };
  baggage: {
    economy: number;
    business: number;
  };
}

export interface Route {
  from: AirportCode;
  to: AirportCode;
  distance: number;
  duration: number;
  basePrice: number;
  businessMultiplier: number;
}

export interface FlightSchedule {
  routeId: string;
  flightNumber: string;
  departureTime: string;
  frequency: string[];
}

export interface FlightServices {
  economy: string[];
  business: string[];
}

export interface Passenger {
  firstName: string;
  lastName: string;
  passport: string;
  email: string;
  phone: string;
}