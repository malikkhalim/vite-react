export interface FlightSearchRequest {
  from: string;
  to: string;
  date: string;
  returnDate?: string;
  passengers: {
    adult: number;
    child: number;
    infant: number;
  };
}

export interface FlightSearchResponse {
  Username: string;
  TripDetail: Array<{
    CityFrom: string;
    CityTo: string;
    Category: 'Departure' | 'Return';
    FlightRoute: Array<{
      CityFrom: string;
      CityTo: string;
      Std: string;
      Sta: string;
      Segments: Array<{
        CarrierCode: string;
        NoFlight: string;
        DepartureStation: string;
        ArrivalStation: string;
        Price: string;
        Currency: string;
        StatusAvail: string;
      }>;
    }>;
  }>;
  ErrorCode?: string;
  ErrorMessage?: string;
}