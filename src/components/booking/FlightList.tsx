import React from 'react';
import { Plane, Clock } from 'lucide-react';
import { formatTime, formatDuration } from '../../utils/dates';
import { formatCurrency } from '../../utils/formatting';
import type { Flight } from '../../types/flight';

interface FlightListProps {
  flights: Flight[];
  onSelect: (flight: Flight) => void;
  loading?: boolean;
}

export function FlightList({ flights, onSelect, loading }: FlightListProps) {
  if (loading) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Searching for flights...</p>
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No flights found for your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {flights.map((flight) => (
        <div key={flight.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <p className="text-2xl font-bold">{formatTime(flight.departureDate)}</p>
                  <p className="text-gray-600">{flight.from}</p>
                </div>

                <div className="flex-1 flex flex-col items-center">
                  <div className="text-sky-600 text-sm">
                    {formatDuration(flight.duration)}
                  </div>
                  <div className="w-full h-px bg-gray-300 relative">
                    <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 text-sky-600" />
                  </div>
                  <div className="text-gray-500 text-sm">Direct</div>
                </div>

                <div className="text-center">
                  <p className="text-2xl font-bold">{formatTime(flight.arrivalDate)}</p>
                  <p className="text-gray-600">{flight.to}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Flight {flight.id}
                </div>
                <div>{flight.aircraft}</div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-3xl font-bold text-sky-600">
                  {formatCurrency(flight.price)}
                </p>
                <p className="text-sm text-gray-500">per person</p>
              </div>

              <button
                onClick={() => onSelect(flight)}
                className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition-colors"
              >
                Select Flight
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}