import React from 'react';
import { ItineraryHeader } from './ItineraryHeader';
import { FlightDetails } from './FlightDetails';
import { PassengerDetails } from './PassengerDetails';
import { TermsAndConditions } from './TermsAndConditions';
import { CompanyFooter } from './CompanyFooter';
import type { Flight } from '../../types/flight';

interface FlightItineraryProps {
  flight: Flight;
  passengers: Array<{
    name: string;
    type: string;
    seat?: string;
  }>;
  bookingReference: string;
  bookingDate: string;
}

export function FlightItinerary({ 
  flight, 
  passengers,
  bookingReference,
  bookingDate 
}: FlightItineraryProps) {
  return (
    <div className="max-w-[800px] mx-auto bg-white p-8 space-y-8">
      <ItineraryHeader 
        bookingReference={bookingReference}
        bookingDate={bookingDate}
      />
      
      <FlightDetails flight={flight} />
      
      <PassengerDetails passengers={passengers} />
      
      <TermsAndConditions />
      
      <CompanyFooter />
    </div>
  );
}