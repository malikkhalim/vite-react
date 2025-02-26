import React from 'react';
import { ReservationDetails } from './ReservationDetails';
import { ItineraryTable } from './ItineraryTable';
import { CheckInInfo } from './CheckInInfo';
import { PassengerTable } from './PassengerTable';
import { Notice } from './Notice';
import { CompanyInfo } from './CompanyInfo';

interface ReturnFlightItineraryProps {
  reservation: {
    agencyName: string;
    referenceNumber: string;
    companyName: string;
    status: string;
    issueDate: string;
    bookingCode: string;
  };
  flights: Array<{
    flightNo: string;
    departure: {
      airport: string;
      code: string;
      terminal?: string;
      date: string;
      time: string;
    };
    arrival: {
      airport: string;
      code: string;
      terminal?: string;
      date: string;
      time: string;
    };
    class: string;
    nvb: string;
    nva: string;
    status: string;
    baggage: string;
  }>;
  passengers: Array<{
    no: number;
    name: string;
    ticketNumber: string;
    ssr?: string;
  }>;
}

export function ReturnFlightItinerary({ 
  reservation,
  flights,
  passengers
}: ReturnFlightItineraryProps) {
  return (
    <div className="max-w-[800px] mx-auto bg-white p-8">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-red-600">AERO DILI</h1>
          <p className="text-sm italic">Build The Nation</p>
        </div>
        <div className="bg-contain bg-no-repeat w-32 h-32" 
          style={{ backgroundImage: 'url("/path/to/pattern.png")' }} 
        />
      </div>

      <ReservationDetails reservation={reservation} />
      
      <ItineraryTable flights={flights} />
      
      <CheckInInfo />
      
      <PassengerTable passengers={passengers} />
      
      <Notice />
      
      <CompanyInfo />
    </div>
  );
}