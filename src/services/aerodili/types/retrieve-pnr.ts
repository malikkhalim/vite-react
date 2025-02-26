export interface TravelDoc {
  DocType: string;
  DocNumber: string;
  ExpirationDate: string | null;
}

export interface PassengerDetail {
  No: string;
  Suffix: string;
  FirstName: string;
  LastName: string;
  SeatQty: string;
  TicketNumber: string;
  FrequentFlyerNumber: string | null;
  SpecialRequest: string;
  TravelDoc: TravelDoc[];
}

export interface Segment {
  FlownDate: string;
  FlightNo: string;
  CityFrom: string;
  CityTo: string;
  CityFromName: string;
  CityToName: string;
  StdLT: string;
  StaLT: string;
  ReservationStatus: string;
  Class: string;
  CheckInStatus: string;
}

export interface ReservationDetails {
  BookingCode: string;
  BookingDate: string;
  BalanceDue: string;
  BalanceDueRemarks: string;
  CurrencyCode: string;
  Time: string;
  TimeDescription: string;
  Status: string;
}

export interface PaymentDetails {
  BasicFare: string;
  Others: string;
  Sti: string | null;
  Total: string;
  DirectVoucher: string;
  AddOn: string;
  Nta: string;
  CurrencyCode: string;
}

export interface ContactInfo {
  Type: string;
  Description: string;
  Value: string;
}

export interface RetrievePNRResponse {
  Username: string;
  BookingCode: string;
  PromoCode: string | null;
  YourItineraryDetails: {
    ReservationDetails: ReservationDetails;
    PassengerDetails: PassengerDetail[];
    ItineraryDetails: {
      Journey: Array<{
        Segment: Segment[];
      }>;
    };
    PaymentDetails: PaymentDetails;
    ContactList: ContactInfo[];
    AgentDetails: {
      BookedBy: string;
      IssuedBy: string;
    };
  };
  ErrorCode: string;
  ErrorMessage: string;
}

export interface BookingDetails {
  bookingCode: string;
  status: string;
  bookingDate: string;
  totalAmount: number;
  currency: string;
  passengers: Array<{
    name: string;
    ticketNumber: string;
    passport: string;
  }>;
  flights: Array<{
    flightNumber: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    class: string;
    status: string;
  }>;
  contact: {
    phone: string;
    email: string;
  };
}