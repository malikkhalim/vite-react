import { PassengerType } from './flight';

export interface PassengerData {
  type: PassengerType;
  salutation: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber: string;
  passportExpiry: string;
  country: string;
}

export interface ContactData {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}