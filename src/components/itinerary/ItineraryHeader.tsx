import React from 'react';
import { Plane } from 'lucide-react';

interface ItineraryHeaderProps {
  bookingReference: string;
  bookingDate: string;
}

export function ItineraryHeader({ bookingReference, bookingDate }: ItineraryHeaderProps) {
  return (
    <div className="border-b border-gray-200 pb-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Plane className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-xl font-bold text-red-600">AERO DILI</h1>
            <p className="text-sm text-gray-600">Your E-Ticket</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Booking Reference</p>
          <p className="font-bold">{bookingReference}</p>
          <p className="text-sm text-gray-600 mt-1">Date of Issue</p>
          <p>{bookingDate}</p>
        </div>
      </div>
    </div>
  );
}