import React, { useState } from 'react';
import { Flight, PassengerCount } from '../../types/flight';
import { PassengerDetails } from './PassengerForm/PassengerDetails';
import { ContactDetails } from './PassengerForm/ContactDetails';
import { FlightSummary } from './PassengerForm/FlightSummary';

interface PassengerFormProps {
  flight: Flight;
  passengerCount: PassengerCount;
  onSubmit: (data: any) => void;
}

interface PassengerData {
  type: 'adult' | 'child' | 'infant';
  salutation: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber: string;
  passportExpiry: string;
}

interface ContactData {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export default function PassengerForm({ flight, passengerCount, onSubmit }: PassengerFormProps) {
  // Initialize passenger data based on counts
  const [passengers, setPassengers] = useState<PassengerData[]>(() => {
    const list: PassengerData[] = [];
    
    // Add adults
    for (let i = 0; i < passengerCount.adult; i++) {
      list.push({
        type: 'adult',
        salutation: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        passportNumber: '',
        passportExpiry: '',
      });
    }
    
    // Add children
    for (let i = 0; i < passengerCount.child; i++) {
      list.push({
        type: 'child',
        salutation: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        passportNumber: '',
        passportExpiry: '',
      });
    }
    
    // Add infants
    for (let i = 0; i < passengerCount.infant; i++) {
      list.push({
        type: 'infant',
        salutation: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        passportNumber: '',
        passportExpiry: '',
      });
    }
    
    return list;
  });

  const [contactDetails, setContactDetails] = useState<ContactData>({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handlePassengerChange = (index: number, field: string, value: string) => {
    setPassengers(prev => prev.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    ));
  };

  const handleContactChange = (field: string, value: string) => {
    setContactDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      passengers,
      contactDetails
    });
  };

  const calculateTotalPrice = () => {
    const adultPrice = passengerCount.adult * flight.price;
    const childPrice = passengerCount.child * flight.price;
    const infantPrice = passengerCount.infant * (flight.price * 0.1); // 10% of adult fare
    return adultPrice + childPrice + infantPrice;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FlightSummary 
        flight={flight} 
        passengerCount={passengerCount}
        totalPrice={calculateTotalPrice()} 
      />

      {/* Group passengers by type */}
      {['adult', 'child', 'infant'].map((type) => {
        const typePassengers = passengers.filter(p => p.type === type);
        if (typePassengers.length === 0) return null;

        return (
          <div key={type} className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 capitalize">
              {type} Passengers
            </h3>
            {typePassengers.map((passenger, typeIndex) => {
              const globalIndex = passengers.findIndex(p => p === passenger);
              return (
                <PassengerDetails
                  key={globalIndex}
                  index={globalIndex}
                  type={type as 'adult' | 'child' | 'infant'}
                  values={passenger}
                  onChange={handlePassengerChange}
                />
              );
            })}
          </div>
        );
      })}

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