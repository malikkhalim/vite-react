import React, { useState, useCallback } from 'react';
import { FlightSearchAdapter } from '../services/aerodili/adapters/flight-search';
import { PNRAdapter } from '../services/aerodili/adapters/pnr';
import { IssuingAdapter } from '../services/aerodili/adapters/issuing';
import type { Flight, BookingFormData, FlightClass } from '../types/flight';
import type { PassengerData } from '../types/passenger';

export function useBookingFlow() {
  // Basic state
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [searchData, setSearchData] = useState<BookingFormData | null>(null);
  const [flights, setFlights] = useState<{ outbound: Flight[], return: Flight[] }>({
    outbound: [],
    return: []
  });
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<Flight | null>(null);
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [ticketIssued, setTicketIssued] = useState(false);
  const [passengerData, setPassengerData] = useState<PassengerData[]>([]);
  const [contactData, setContactData] = useState<any>(null);

  const [bookingDetails, setBookingDetails] = useState<{
    status: string;
    totalAmount: number;
    currency: string;
    timeLimit?: string;
  } | null>(null);

  // Navigation helper
  const goBack = useCallback(() => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  }, [step]);

  // Step 1: Search Flights
  const searchFlights = useCallback(async (formData: BookingFormData) => {
    console.log("Searching flights with data:", formData);
    setLoading(true);
    setError(null);
    
    try {
      // Call the API
      const results = await FlightSearchAdapter.searchFlights(formData);
      
      console.log("Search results:", results);
      
      // Store flights in the flights state
      setFlights({
        outbound: results.outboundFlights || [],
        return: results.returnFlights || []
      });
      
      // Also store flights in the searchData for easier access
      const updatedFormData: BookingFormData = {
        ...formData,
        outboundFlights: results.outboundFlights,
        returnFlights: results.returnFlights
      };
      
      setSearchData(updatedFormData);
      setStep(2);
    } catch (err) {
      console.error("Flight search error:", err);
      setError(err instanceof Error ? err.message : 'Flight search failed');
    } finally {
      setLoading(false);
    }
  }, []);

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
  const handleDateChange = useCallback(async (date: string, isReturn: boolean = false) => {
    if (!searchData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Create updated search data with the new date
      const updatedSearchData: BookingFormData = {
        ...searchData,
        [isReturn ? 'returnDate' : 'departureDate']: date
      };
      
      // Make a new search with the updated date
      const results = await FlightSearchAdapter.searchFlights(updatedSearchData);
      
      console.log(`${isReturn ? 'Return' : 'Outbound'} date search results:`, results);
      
      // Update flights in the flights state
      if (isReturn) {
        setFlights(prev => ({
          ...prev,
          return: results.returnFlights || []
        }));
        
        // Also update the searchData
        updatedSearchData.returnFlights = results.returnFlights;
      } else {
        setFlights(prev => ({
          ...prev,
          outbound: results.outboundFlights || []
        }));
        
        // Also update the searchData
        updatedSearchData.outboundFlights = results.outboundFlights;
      }
      
      setSearchData(updatedSearchData);
      
      // Clear selected flight if date changes
      if (isReturn) {
        setSelectedReturnFlight(null);
      } else {
        setSelectedFlight(null);
      }
      
    } catch (err) {
      console.error("Flight search error:", err);
      setError(err instanceof Error ? err.message : 'Flight search failed');
    } finally {
      setLoading(false);
    }
  }, [searchData]);

  // Step 3: Submit Passenger Details
  const submitPassengerDetails = useCallback(async (data: any) => {
    if (!selectedFlight || !searchData) {
      setError("No flight selected. Please select a flight before continuing.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("Submitting passenger details:", data);
      
      const { passengers, contactDetails } = data;
      
      // Save data in state
      setPassengerData(passengers);
      setContactData(contactDetails);
      
      // Try with the real PNR generation
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
      
      console.log("PNR generation successful:", result);
      
      // Save booking details for later use
      setBookingCode(result.bookingCode);
      setBookingDetails({
        status: result.status,
        totalAmount: result.totalAmount,
        currency: result.currency || 'USD',
        timeLimit: result.timeLimit || undefined
      });
      
      setStep(4); // Move to payment
    } catch (err) {
      console.error("PNR generation error:", err);
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  }, [selectedFlight, selectedReturnFlight, searchData]);

  
  
  // Also update the processPayment function to bypass the real API call
  const processPayment = useCallback(async (paymentDetails: any) => {
    if (!bookingCode) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log("⚠️ BYPASSING REAL PAYMENT PROCESSING WITH MOCK DATA");
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful payment and ticket issuance
      setTicketIssued(true);
      setStep(5); // Move to confirmation
    } catch (err) {
      console.error("Payment/ticketing error:", err);
      setError(err instanceof Error ? err.message : 'Payment processing failed');
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
    setPassengerData([]);
    setContactData(null);
    setError(null);
  }, []);

  // Calculate total price
  const calculateTotalPrice = useCallback(() => {
    // If we have booking details from the PNR, use that amount
    if (bookingDetails?.totalAmount) {
      return bookingDetails.totalAmount;
    }
    
    // Otherwise calculate it from the flight price
    if (!selectedFlight) return 0;
    
    const outboundPrice = searchData?.class === 'business'
      ? selectedFlight.businessPrice
      : selectedFlight.price;
      
    const returnPrice = selectedReturnFlight && searchData?.class === 'business'
      ? selectedReturnFlight.businessPrice
      : selectedReturnFlight?.price || 0;
      
    const passengerCount = searchData?.passengers.adult || 0 + 
                          (searchData?.passengers.child || 0);
                          
    return (outboundPrice + returnPrice) * passengerCount;
  }, [selectedFlight, selectedReturnFlight, searchData, bookingDetails]);

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
    passengerData,
    contactData,
    bookingDetails,
    searchFlights,
    selectFlight,
    submitPassengerDetails,
    processPayment,
    resetBooking,
    handleDateChange,
    calculateTotalPrice,
    goBack
  };
}