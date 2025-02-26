import { useState, useCallback } from 'react';
import { Flight, BookingFormData } from '../types/flight';

interface BookingData {
  passengers: any[];
  contactDetails: {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
  totalAmount: number;
}

export function useBookingFlow() {
  const [step, setStep] = useState(1);
  const [searchData, setSearchData] = useState<BookingFormData | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);

  const calculateTotalAmount = (flight: Flight, passengers: any) => {
    const adultPrice = passengers.adult * flight.price;
    const childPrice = passengers.child * flight.price;
    const infantPrice = passengers.infant * (flight.price * 0.1); // 10% of adult fare
    return adultPrice + childPrice + infantPrice;
  };

  const handleSearch = useCallback((data: BookingFormData) => {
    setSearchData(data);
    setStep(2);
  }, []);

  const handleFlightSelect = useCallback((flight: Flight) => {
    setSelectedFlight(flight);
    setStep(3);
  }, []);

  const handlePassengerSubmit = useCallback((data: any) => {
    if (selectedFlight && searchData) {
      const totalAmount = calculateTotalAmount(selectedFlight, searchData.passengers);
      setBookingData({ ...data, totalAmount });
      setStep(4);
    }
  }, [selectedFlight, searchData]);

  const handlePaymentSubmit = useCallback(() => {
    setStep(5);
  }, []);

  const handleBookingComplete = useCallback(() => {
    setStep(1);
    setSearchData(null);
    setSelectedFlight(null);
    setBookingData(null);
  }, []);

  const handleDateChange = useCallback((date: string) => {
    if (searchData) {
      setSearchData({ ...searchData, departureDate: date });
    }
  }, [searchData]);

  const goBack = useCallback(() => {
    if (step > 1) {
      setStep(step - 1);
    }
  }, [step]);

  return {
    step,
    searchData,
    selectedFlight,
    bookingData,
    handleSearch,
    handleFlightSelect,
    handlePassengerSubmit,
    handlePaymentSubmit,
    handleBookingComplete,
    handleDateChange,
    goBack,
  };
}