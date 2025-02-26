export interface TravelDoc {
  DocType: string;
  DocNumber: string;
  ExpirationDate: string | null;
}

export interface PassengerDetails {
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

export interface SegmentDetails {
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

export interface AgentDetails {
  BookedBy: string;
  IssuedBy: string;
}

export interface PNRResponse {
  Username: string;
  BookingCode: string;
  YourItineraryDetails: {
    ReservationDetails: ReservationDetails;
    PassengerDetails: PassengerDetails[];
    ItineraryDetails: {
      Journey: {
        Segment: SegmentDetails[];
      }[];
    };
    PaymentDetails: PaymentDetails;
    ContactList: ContactInfo[];
    AgentDetails: AgentDetails;
  };
  ErrorCode: string;
  ErrorMessage: string;
}