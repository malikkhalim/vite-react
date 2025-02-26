export interface ClassAvailable {
  Key: string;
  Availability: string;
  Class: string;
  SeatAvail: string;
  Price: string;
  Currency: string;
  StatusAvail: string;
}

export interface FlightSegment {
  CarrierCode: string;
  NoFlight: string;
  DepartureStation: string;
  ArrivalStation: string;
  Std: string;
  Sta: string;
}

export interface FlightRoute {
  CityFrom: string;
  CityTo: string;
  Std: string;
  Sta: string;
  Segments: FlightSegment[];
  ClassesAvailable: ClassAvailable[];
}

export interface TripDetail {
  CityFrom: string;
  CityTo: string;
  Category: 'Departure' | 'Return';
  FlightRoute: FlightRoute[];
}

export interface FlightSearchResponse {
  Username: string;
  Adult: string;
  Child: string;
  Infant: string;
  TripDetail: TripDetail[];
  ErrorCode: string;
  ErrorMessage: string;
}

export interface FlightSearchRequest {
  ReturnStatus: 'YES' | 'NO';
  CityFrom: string;
  CityTo: string;
  DepartDate: string;
  ReturnDate: string;
  PromoCode: string;
  Adult: string;
  Child: string;
  Infant: string;
}