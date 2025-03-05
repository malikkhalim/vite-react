import { format } from 'date-fns';
import { SoapClient } from '../client/soap-client';
import { SOAP_ENDPOINTS } from '../config/endpoints';
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
    const adultPassengers = passengers.filter(p => p.type === 'adult');
    const childPassengers = passengers.filter(p => p.type === 'child');
    const infantPassengers = passengers.filter(p => p.type === 'infant');

    const requestData = {
      Username: 'DILTRAVEL002',
      Password: 'Abc12345',
      Received: 'AGENT',
      ReceivedPhone: contactDetails.phone,
      Email: contactDetails.email.toUpperCase(),
      SearchKey: flight.searchKey,
      AdultNames: adultPassengers.map(p => ({
        FirstName: p.firstName.toUpperCase(),
        LastName: p.lastName.toUpperCase(),
        Suffix: p.salutation,
        Dob: '-',
        IdNo: p.passportNumber,
        Passport: {
          PassportNumber: p.passportNumber,
          ExpiryDate: format(new Date(p.passportExpiry), 'dd-MMM-yy')
        }
      })),
      ChildNames: childPassengers.map(p => ({
        FirstName: p.firstName.toUpperCase(),
        LastName: p.lastName.toUpperCase(),
        Suffix: p.salutation,
        Dob: format(new Date(p.dateOfBirth), 'yyyy-MM-dd'),
        IdNo: p.passportNumber,
        Passport: {
          PassportNumber: p.passportNumber,
          ExpiryDate: format(new Date(p.passportExpiry), 'dd-MMM-yy')
        }
      })),
      InfantNames: infantPassengers.map((p, index) => ({
        FirstName: p.firstName.toUpperCase(),
        LastName: p.lastName.toUpperCase(),
        Dob: format(new Date(p.dateOfBirth), 'yyyy-MM-dd'),
        AdultRefference: (index + 1).toString(),
        Passport: {
          PassportNumber: p.passportNumber,
          ExpiryDate: format(new Date(p.passportExpiry), 'dd-MMM-yy')
        }
      })),
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

    const response = await SoapClient.execute(
      SOAP_ENDPOINTS.GENERATE_PNR,
      requestData
    );

    if (!response.success) {
      throw new Error(response.error?.message || 'PNR generation failed');
    }

    return {
      bookingCode: response.data.BookingCode,
      status: response.data.YourItineraryDetails.ReservationDetails.Status,
      totalAmount: parseFloat(response.data.YourItineraryDetails.PaymentDetails.Total)
    };
  }
}