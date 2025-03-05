import { format } from 'date-fns';
import { SoapClient } from '../client/soap-client';
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
    try {
      console.log("Generating PNR with:", { passengers, contactDetails, flight, returnFlight });
      
      const adultPassengers = passengers.filter(p => p.type === 'adult');
      const childPassengers = passengers.filter(p => p.type === 'child');
      const infantPassengers = passengers.filter(p => p.type === 'infant');

      // Create the formatted data for the SOAP request
      const requestData = {
        Username: 'DILTRAVEL002',
        Password: 'Abc12345',
        Received: 'AGENT',
        ReceivedPhone: contactDetails.phone || '',
        Email: contactDetails.email ? contactDetails.email.toUpperCase() : '',
        SearchKey: flight.searchKey || '',
        AdultNames: adultPassengers.map(p => ({
          FirstName: p.firstName ? p.firstName.toUpperCase() : '',
          LastName: p.lastName ? p.lastName.toUpperCase() : '',
          Suffix: p.salutation || '',
          Dob: '-',
          IdNo: p.passportNumber || '',
          Passport: {
            PassportNumber: p.passportNumber || '',
            ExpiryDate: p.passportExpiry ? format(new Date(p.passportExpiry), 'dd-MMM-yy') : ''
          }
        })),
        ChildNames: childPassengers.map(p => ({
          FirstName: p.firstName ? p.firstName.toUpperCase() : '',
          LastName: p.lastName ? p.lastName.toUpperCase() : '',
          Suffix: p.salutation || '',
          Dob: p.dateOfBirth ? format(new Date(p.dateOfBirth), 'yyyy-MM-dd') : '',
          IdNo: p.passportNumber || '',
          Passport: {
            PassportNumber: p.passportNumber || '',
            ExpiryDate: p.passportExpiry ? format(new Date(p.passportExpiry), 'dd-MMM-yy') : ''
          }
        })),
        InfantNames: infantPassengers.map((p, index) => ({
          FirstName: p.firstName ? p.firstName.toUpperCase() : '',
          LastName: p.lastName ? p.lastName.toUpperCase() : '',
          Dob: p.dateOfBirth ? format(new Date(p.dateOfBirth), 'yyyy-MM-dd') : '',
          AdultRefference: (index + 1).toString(),
          Passport: {
            PassportNumber: p.passportNumber || '',
            ExpiryDate: p.passportExpiry ? format(new Date(p.passportExpiry), 'dd-MMM-yy') : ''
          }
        })),
        Keys: [
          {
            Key: flight.classKey,
            Category: 'Departure'
          },
          ...(returnFlight && returnFlight.classKey ? [{
            Key: returnFlight.classKey,
            Category: 'Return'
          }] : [])
        ]
      };

      console.log("PNR request data:", requestData);

      // Make the SOAP request
      const response = await SoapClient.execute(
        'WsGeneratePNR',
        requestData
      );

      console.log("PNR response:", response);

      if (!response.success) {
        throw new Error(response.error?.message || 'PNR generation failed');
      }

      // Extract booking details from response
      const bookingCode = response.data?.BookingCode || '';
      const status = response.data?.YourItineraryDetails?.ReservationDetails?.Status || '';
      const totalAmount = parseFloat(response.data?.YourItineraryDetails?.PaymentDetails?.Total || '0');

      return {
        bookingCode,
        status,
        totalAmount
      };
    } catch (error) {
      console.error("PNR generation error:", error);
      throw error;
    }
  }
}