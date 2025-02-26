import { PassengerType } from '../../../types/flight';

export interface PassportInfo {
  PassportNumber: string;
  ExpiryDate: string;
  IssuingCountry?: string;
  IssuingDate?: string;
}

export interface PassengerPNRInfo {
  FirstName: string;
  LastName: string;
  Suffix: string;
  Dob: string;
  IdNo: string;
  Passport: PassportInfo;
}

export interface InfantPNRInfo extends Omit<PassengerPNRInfo, 'Suffix'> {
  AdultRefference: string;
}

export interface GeneratePNRRequest {
  Username: string;
  Password: string;
  Received: string;
  ReceivedPhone: string;
  Email: string;
  SearchKey: string;
  ExtraCoverAddOns?: string;
  AdultNames: PassengerPNRInfo[];
  ChildNames: PassengerPNRInfo[];
  InfantNames: InfantPNRInfo[];
  Keys: Array<{
    Key: string;
    Category: 'Departure' | 'Return';
  }>;
}

export interface GeneratePNRResponse {
  PNR: string;
  Status: string;
  ErrorCode: string;
  ErrorMessage: string;
}