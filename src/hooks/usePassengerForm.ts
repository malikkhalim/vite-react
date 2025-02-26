import { useState } from 'react';
import { Flight, PassengerCount } from '../types/flight';
import { PassengerData, ContactData } from '../types/passenger';
import { initializePassengers } from '../utils/passenger';

export function usePassengerForm(
  flight: Flight,
  passengerCount: PassengerCount,
  onSubmit: (data: any) => void
) {
  const [passengers, setPassengers] = useState<PassengerData[]>(() => 
    initializePassengers(passengerCount)
  );

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

  return {
    passengers,
    contactDetails,
    handlePassengerChange,
    handleContactChange,
    handleSubmit,
    calculateTotalPrice,
  };
}