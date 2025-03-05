import React from 'react';
import { ArrowRight } from 'lucide-react';
import { DateNavigation } from './DateNavigation';
import FlightCard from './FlightCard';
import { Flight, FlightClass, BookingFormData } from '../../types/flight';

interface FlightSearchProps {
  searchData: BookingFormData;
  selectedClass: FlightClass;
  onDateChange: (date: string, isReturn?: boolean) => void;
  onFlightSelect: (flight: Flight, isReturn?: boolean) => void;
  selectedOutboundFlight?: Flight | null;
  selectedReturnFlight?: Flight | null;
}

export function FlightSearch({
  searchData,
  selectedClass,
  onDateChange,
  onFlightSelect,
  selectedOutboundFlight,
  selectedReturnFlight
}: FlightSearchProps) {
  // The flights come from the parent component's API call
  
  const handleOutboundDateClick = () => {
    if (selectedOutboundFlight) {
      onFlightSelect(selectedOutboundFlight, false);
    }
  };

  const handleReturnDateClick = () => {
    if (selectedReturnFlight) {
      onFlightSelect(selectedReturnFlight, true);
    }
  };

  return (
    <div className="space-y-8">
      {/* Outbound Flights */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            Outbound Flight
            <span className="text-sm font-normal text-gray-600 flex items-center gap-1">
              {searchData.from} <ArrowRight className="h-4 w-4" /> {searchData.to}
            </span>
          </h2>
          {selectedOutboundFlight && searchData.tripType === 'return' && !selectedReturnFlight && (
            <p className="text-sm text-sky-600">Please select your return flight</p>
          )}
        </div>

        <DateNavigation
          currentDate={searchData.departureDate}
          onDateChange={(date) => onDateChange(date, false)}
          disabled={selectedOutboundFlight && searchData.tripType === 'return' && !selectedReturnFlight}
          onClick={handleOutboundDateClick}
        />
        
        {/* This will be populated with API data now */}
        <div className="space-y-4">
          {searchData.outboundFlights && searchData.outboundFlights.length > 0 ? (
            searchData.outboundFlights.map(flight => (
              <FlightCard
                key={flight.id}
                flight={flight}
                onSelect={(f) => onFlightSelect(f, false)}
                selectedClass={selectedClass}
                isSelected={selectedOutboundFlight?.id === flight.id}
              />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">
                No outbound flights available for the selected date.
                Please try a different date.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Return Flights */}
      {searchData.tripType === 'return' && selectedOutboundFlight && (
        <div className="space-y-6 border-t border-gray-200 pt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              Return Flight
              <span className="text-sm font-normal text-gray-600 flex items-center gap-1">
                {searchData.to} <ArrowRight className="h-4 w-4" /> {searchData.from}
              </span>
            </h2>
            {selectedReturnFlight && (
              <button
                onClick={() => onFlightSelect(selectedOutboundFlight, false)}
                className="text-sm text-sky-600 hover:text-sky-700"
              >
                Change outbound flight
              </button>
            )}
          </div>

          <DateNavigation
            currentDate={searchData.returnDate || ''}
            onDateChange={(date) => onDateChange(date, true)}
            disabled={!selectedOutboundFlight}
            onClick={handleReturnDateClick}
          />
          
          {/* This will be populated with API data now */}
          <div className="space-y-4">
            {searchData.returnFlights && searchData.returnFlights.length > 0 ? (
              searchData.returnFlights.map(flight => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  onSelect={(f) => onFlightSelect(f, true)}
                  selectedClass={selectedClass}
                  isSelected={selectedReturnFlight?.id === flight.id}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-600">
                  No return flights available for the selected date.
                  Please try a different date.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Continue Button */}
      {((searchData.tripType === 'one-way' && selectedOutboundFlight) ||
        (searchData.tripType === 'return' && selectedOutboundFlight && selectedReturnFlight)) && (
        <div className="flex justify-end border-t border-gray-200 pt-6">
          <button
            onClick={() => onFlightSelect(selectedOutboundFlight, false)}
            className="bg-sky-600 text-white px-8 py-3 rounded-md hover:bg-sky-700 transition-colors"
          >
            Continue to Passenger Details
          </button>
        </div>
      )}
    </div>
  );
}