import { format } from 'date-fns';
import { SOAP_CREDENTIALS } from '../config/endpoints';
import { SoapClient } from '../client/soap-client';
import { PNRTransformer } from '../utils/pnr-transformer';
import type { GeneratePNRRequest } from '../types/pnr';
import type { PNRResponse } from '../types/pnr-response';
import type { PassengerData } from '../../../types/passenger';
import type { Flight } from '../../../types/flight';

export class PNRAdapter {
  static async generatePNR(
    passengers: PassengerData[],
    contactDetails: {
      name: string;
      phone: string;
      email: string;
    },
    flight: Flight,
    returnFlight?: Flight
  ) {
    const request: GeneratePNRRequest = {
      Username: SOAP_CREDENTIALS.USERNAME,
      Password: SOAP_CREDENTIALS.PASSWORD,
      Received: 'AGENT',
      ReceivedPhone: contactDetails.phone,
      Email: contactDetails.email.toUpperCase(),
      SearchKey: flight.searchKey,
      AdultNames: this.formatAdultPassengers(passengers),
      ChildNames: this.formatChildPassengers(passengers),
      InfantNames: this.formatInfantPassengers(passengers),
      Keys: [
        {
          Key: flight.classKey,
          Category: 'Departure'
        },
        ...(returnFlight ? [{
          Key: returnFlight.classKey,
          Category: 'Return'
        }] : [])
      ]
    };

    const response = await SoapClient.execute<PNRResponse>(
      'WsGeneratePNR',
      request
    );

    if (!response.success) {
      throw new Error(response.error.message);
    }

    return PNRTransformer.transformResponse(response.data);
  }

  private static formatAdultPassengers(passengers: PassengerData[]) {
    return passengers
      .filter(p => p.type === 'adult')
      .map(p => ({
        FirstName: p.firstName.toUpperCase(),
        LastName: p.lastName.toUpperCase(),
        Suffix: p.salutation,
        Dob: '-',
        IdNo: p.passportNumber,
        Passport: {
          PassportNumber: p.passportNumber,
          ExpiryDate: format(new Date(p.passportExpiry), 'dd-MMM-yy')
        }
      }));
  }

  private static formatChildPassengers(passengers: PassengerData[]) {
    return passengers
      .filter(p => p.type === 'child')
      .map(p => ({
        FirstName: p.firstName.toUpperCase(),
        LastName: p.lastName.toUpperCase(),
        Suffix: p.salutation,
        Dob: '-',
        IdNo: p.passportNumber,
        Passport: {
          PassportNumber: p.passportNumber,
          ExpiryDate: format(new Date(p.passportExpiry), 'dd-MMM-yy')
        }
      }));
  }

  private static formatInfantPassengers(passengers: PassengerData[]) {
    return passengers
      .filter(p => p.type === 'infant')
      .map((p, index) => ({
        FirstName: p.firstName.toUpperCase(),
        LastName: p.lastName.toUpperCase(),
        Dob: format(new Date(p.dateOfBirth), 'yyyy-MM-dd'),
        AdultRefference: (index + 1).toString(),
        IdNo: p.passportNumber,
        Passport: {
          PassportNumber: p.passportNumber,
          ExpiryDate: format(new Date(p.passportExpiry), 'dd-MMM-yy')
        }
      }));
  }
}