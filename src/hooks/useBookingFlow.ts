import { useState, useCallback } from 'react';
import { FlightSearchAdapter } from '../services/aerodili/adapters/flight-search';
import { PNRAdapter } from '../services/aerodili/adapters/pnr';
import { IssuingAdapter } from '../services/aerodili/adapters/issuing';
import { RetrievePNRAdapter } from '../services/aerodili/adapters/retrieve-pnr';
import type { BookingFormData, Flight } from '../types/flight';
import type { PassengerData } from '../types/passenger';

export function useBookingFlow() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchData, setSearchData] = useState<BookingFormData | null>(null);
  const [flights, setFlights] = useState<{ outbound: Flight[], return: Flight[] }>({
    outbound: [],
    return: []
  });
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<Flight | null>(null);
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [ticketIssued, setTicketIssued] = useState(false);

  // Search flights
  const searchFlights = useCallback(async (formData: BookingFormData) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await FlightSearchAdapter.searchFlights(formData);
      setFlights({
        outbound: results.outboundFlights,
        return: results.returnFlights
      });
      setSearchData(formData);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Select flight
  const selectFlight = useCallback((flight: Flight, isReturn: boolean = false) => {
    if (isReturn) {
      setSelectedReturnFlight(flight);
    } else {
      setSelectedFlight(flight);
    }
    
    // Move to passenger details if we have all required flights
    if (
      (searchData?.tripType === 'one-way' && !isReturn) || 
      (searchData?.tripType === 'return' && ((isReturn && selectedFlight) || (!isReturn && selectedReturnFlight)))
    ) {
      setStep(3);
    }
  }, [searchData?.tripType, selectedFlight, selectedReturnFlight]);

  // Submit passenger details
  const submitPassengerDetails = useCallback(async (
    passengers: PassengerData[],
    contactDetails: { name: string; email: string; phone: string }
  ) => {
    if (!selectedFlight || !searchData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await PNRAdapter.generatePNR(
        passengers,
        contactDetails,
        selectedFlight,
        searchData.tripType === 'return' ? selectedReturnFlight : undefined
      );
      
      setBookingCode(result.bookingCode);
      setStep(4); // Move to payment
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  }, [selectedFlight, selectedReturnFlight, searchData]);

  // Process payment and issue ticket
  const processPayment = useCallback(async (paymentDetails: any) => {
    if (!bookingCode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, you'd process payment through a payment gateway
      // After successful payment, issue the ticket
      const result = await IssuingAdapter.issueTicket(bookingCode);
      
      if (result.success) {
        setTicketIssued(true);
        setStep(5); // Move to confirmation
      } else {
        throw new Error('Ticket issuance failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment/ticketing failed');
    } finally {
      setLoading(false);
    }
  }, [bookingCode]);

  // Reset booking flow
  const resetBooking = useCallback(() => {
    setStep(1);
    setSearchData(null);
    setFlights({ outbound: [], return: [] });
    setSelectedFlight(null);
    setSelectedReturnFlight(null);
    setBookingCode(null);
    setTicketIssued(false);
    setError(null);
  }, []);

  return {
    step,
    loading,
    error,
    searchData,
    flights,
    selectedFlight,
    selectedReturnFlight,
    bookingCode,
    ticketIssued,
    searchFlights,
    selectFlight,
    submitPassengerDetails,
    processPayment,
    resetBooking
  };
}