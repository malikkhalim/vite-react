import React from 'react';
import { formatDateTime } from '../../utils/dates';
import type { Flight } from '../../types/flight';

interface FlightDetailsProps {
  flight: Flight;
}

export function FlightDetails({ flight }: FlightDetailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-red-600">Flight Details</h2>
      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Flight</p>
            <p className="font-medium">{flight.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Aircraft</p>
            <p className="font-medium">{flight.aircraft}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">From</p>
            <p className="font-medium">{flight.from}</p>
            <p className="text-sm text-gray-600">{formatDateTime(flight.departureDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">To</p>
            <p className="font-medium">{flight.to}</p>
            <p className="text-sm text-gray-600">{formatDateTime(flight.arrivalDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}