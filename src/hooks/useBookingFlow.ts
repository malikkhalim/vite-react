import { useState, useCallback } from 'react';
import { useFlightSearch } from './useFlightSearch';
import { PNRAdapter } from '../services/aerodili/adapters/pnr';
import { IssuingAdapter } from '../services/aerodili/adapters/issuing';
import type { Flight, BookingFormData, FlightClass } from '../types/flight';
import type { PassengerData } from '../types/passenger';

export function useBookingFlow() {
  // Basic state
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [searchData, setSearchData] = useState<BookingFormData | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<Flight | null>(null);
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [ticketIssued, setTicketIssued] = useState(false);
  const [passengerData, setPassengerData] = useState<PassengerData[]>([]);
  const [contactData, setContactData] = useState<any>(null);
  
  // Use our custom flight search hook
  const { 
    loading: searchLoading, 
    error: searchError, 
    outboundFlights, 
    returnFlights, 
    searchFlights 
  } = useFlightSearch();

  // Navigation helper
  const goBack = useCallback(() => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  }, [step]);

  // Step 1: Search Flights
  const handleSearchFlights = useCallback(async (formData: BookingFormData) => {
    console.log("Handling flight search with data:", formData);
    setError(null);
    setSearchData(formData);
    
    try {
      await searchFlights(formData);
      setStep(2);
    } catch (err) {
      console.error("Flight search error:", err);
      setError(err instanceof Error ? err.message : 'Flight search failed');
    }
  }, [searchFlights]);

  // Step 2: Select Flight
  const selectFlight = useCallback((flight: Flight, isReturn: boolean = false) => {
    if (isReturn) {
      setSelectedReturnFlight(flight);
    } else {
      setSelectedFlight(flight);
    }
    
    // Determine if we should proceed to next step
    if (searchData?.tripType === 'one-way' && !isReturn) {
      setStep(3); // Go to passenger details for one-way
    } else if (searchData?.tripType === 'return') {
      if (
        (isReturn && selectedFlight) || // Just selected return flight & already have outbound
        (!isReturn && selectedReturnFlight) // Just selected outbound & already have return
      ) {
        setStep(3); // Go to passenger details when both flights selected
      }
    }
  }, [searchData?.tripType, selectedFlight, selectedReturnFlight]);

  // Handle date changes for flight search
  const handleDateChange = useCallback((date: string, isReturn: boolean = false) => {
    if (!searchData) return;
    
    const updatedSearchData = {
      ...searchData,
      ...(isReturn ? { returnDate: date } : { departureDate: date })
    };
    
    setSearchData(updatedSearchData);
    searchFlights(updatedSearchData);
  }, [searchData, searchFlights]);

  // Step 3: Submit Passenger Details
  const submitPassengerDetails = useCallback(async (
    passengers: PassengerData[],
    contactDetails: { contactName: string; contactEmail: string; contactPhone: string }
  ) => {
    if (!selectedFlight || !searchData) return;
    
    setError(null);
    setPassengerData(passengers);
    setContactData(contactDetails);
    
    try {
      // Call the actual PNR generation API
      const result = await PNRAdapter.generatePNR(
        passengers,
        {
          name: contactDetails.contactName,
          email: contactDetails.contactEmail,
          phone: contactDetails.contactPhone
        },
        selectedFlight,
        searchData.tripType === 'return' ? selectedReturnFlight : undefined
      );
      
      setBookingCode(result.bookingCode);
      setStep(4); // Move to payment
    } catch (err) {
      console.error("PNR generation error:", err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    }
  }, [selectedFlight, selectedReturnFlight, searchData]);

  // Step 4: Process Payment
  const processPayment = useCallback(async (paymentDetails: any) => {
    if (!bookingCode) return;
    
    setError(null);
    
    try {
      // Process payment and issue ticket
      const result = await IssuingAdapter.issueTicket(bookingCode);
      
      if (result.success) {
        setTicketIssued(true);
        setStep(5); // Move to confirmation
      } else {
        throw new Error('Ticket issuance failed');
      }
    } catch (err) {
      console.error("Payment/ticketing error:", err);
      setError(err instanceof Error ? err.message : 'Payment processing failed');
    }
  }, [bookingCode]);

  // Reset booking flow
  const resetBooking = useCallback(() => {
    setStep(1);
    setSearchData(null);
    setSelectedFlight(null);
    setSelectedReturnFlight(null);
    setBookingCode(null);
    setTicketIssued(false);
    setPassengerData([]);
    setContactData(null);
    setError(null);
  }, []);

  return {
    step,
    loading: searchLoading,
    error: error || searchError,
    searchData,
    flights: { outbound: outboundFlights, return: returnFlights },
    selectedFlight,
    selectedReturnFlight,
    bookingCode,
    ticketIssued,
    passengerData,
    contactData,
    searchFlights: handleSearchFlights,
    selectFlight,
    submitPassengerDetails,
    processPayment,
    resetBooking,
    handleDateChange,
    goBack
  };
}