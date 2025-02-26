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
  searchKey: string; // Added for PNR generation
  classKey: string; // Added for PNR generation
}