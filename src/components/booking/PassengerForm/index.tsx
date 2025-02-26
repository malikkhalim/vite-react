import React from 'react';
import { Flight, PassengerCount } from '../../../types/flight';
import { PassengerList } from './PassengerList';
import { ContactDetails } from './ContactDetails';
import { FlightSummary } from './FlightSummary';
import { usePassengerForm } from '../../../hooks/usePassengerForm';

interface PassengerFormProps {
  flight: Flight;
  passengerCount: PassengerCount;
  onSubmit: (data: any) => void;
}

export default function PassengerForm({ flight, passengerCount, onSubmit }: PassengerFormProps) {
  const {
    passengers,
    contactDetails,
    handlePassengerChange,
    handleContactChange,
    handleSubmit,
    calculateTotalPrice,
  } = usePassengerForm(flight, passengerCount, onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FlightSummary 
        flight={flight} 
        passengerCount={passengerCount}
        totalPrice={calculateTotalPrice()} 
      />

      <PassengerList
        passengers={passengers}
        onChange={handlePassengerChange}
      />

      <ContactDetails
        values={contactDetails}
        onChange={handleContactChange}
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-sky-600 text-white px-8 py-3 rounded-md hover:bg-sky-700 transition-colors"
        >
          Continue to Payment
        </button>
      </div>
    </form>
  );
}