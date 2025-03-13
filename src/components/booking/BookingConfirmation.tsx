import React from 'react';
import { Check } from 'lucide-react';
import { Flight } from '../../types/flight';
import { formatCurrency } from '../../utils/formatting';
import { PassengerData } from '../../types/passenger';

interface BookingConfirmationProps {
  flight: Flight;
  bookingData?: {
    passengers: any[];
    contactDetails: {
      contactName: string;
      contactEmail: string;
      contactPhone: string;
    };
    totalAmount: number;
  };
  onClose: () => void; 
  passengerData?: PassengerData[];
  contactData?: any;
}

export default function BookingConfirmation({ 
  flight, 
  bookingData,
  onClose,
  passengerData,
  contactData
}: BookingConfirmationProps) {
  const passengers = bookingData?.passengers || passengerData || [];
  const contactDetails = bookingData?.contactDetails || contactData || {
    contactName: "Guest",
    contactEmail: "guest@example.com",
    contactPhone: ""
  };
  const totalAmount = bookingData?.totalAmount || flight.price;
  const bookingNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
        <p className="text-gray-600 mt-2">Booking Reference: {bookingNumber}</p>
      </div>

      <div className="border-t border-b border-gray-200 py-4 my-6">
        <h3 className="font-semibold mb-2">Flight Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">From</p>
            <p className="font-medium">{flight.from}</p>
          </div>
          <div>
            <p className="text-gray-600">To</p>
            <p className="font-medium">{flight.to}</p>
          </div>
          <div>
            <p className="text-gray-600">Departure</p>
            <p className="font-medium">
              {new Date(flight.departureDate).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600">Arrival</p>
            <p className="font-medium">
              {new Date(flight.arrivalDate).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Passenger Details</h3>
        <div className="space-y-4">
          {passengers.map((passenger, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {passenger.salutation} {passenger.firstName} {passenger.lastName}
                  </p>
                  <p className="text-gray-600 text-sm capitalize">
                    {passenger.type} Passenger
                  </p>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>Passport: {passenger.passportNumber}</p>
                  <p>Expires: {new Date(passenger.passportExpiry).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Contact Details</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p><span className="text-gray-600">Name:</span> {contactDetails.contactName}</p>
          <p><span className="text-gray-600">Email:</span> {contactDetails.contactEmail}</p>
          <p><span className="text-gray-600">Phone:</span> {contactDetails.contactPhone}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Payment Details</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-lg font-medium text-sky-600">
            Total Amount: {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 mb-4">
          A confirmation email has been sent to {contactDetails.contactEmail}
        </p>
        <button
          onClick={onClose}
          className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}