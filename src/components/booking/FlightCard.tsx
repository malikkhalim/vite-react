import React from 'react';
import { Check } from 'lucide-react';
import { Flight, FlightClass } from '../../types/flight';
import { FlightRoute } from './FlightRoute';
import { FlightPrice } from './FlightPrice';
import { FlightDetails } from './FlightDetails';

interface FlightCardProps {
  flight: Flight;
  onSelect: (flight: Flight) => void;
  selectedClass: FlightClass;
  isSelected?: boolean;
}

export default function FlightCard({ flight, onSelect, selectedClass, isSelected }: FlightCardProps) {
  const classInfo = selectedClass === 'business' 
    ? {
        price: flight.businessPrice,
        seatsLeft: flight.businessSeatsAvailable,
        services: flight.services.business
      }
    : {
        price: flight.price,
        seatsLeft: flight.seatsAvailable,
        services: flight.services.economy
      };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all ${
        isSelected ? 'ring-2 ring-sky-500 bg-sky-50' : ''
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1">
          <FlightRoute
            from={flight.from}
            to={flight.to}
            departureTime={flight.departureDate}
            arrivalTime={flight.arrivalDate}
          />
        </div>

        <FlightPrice
          economyPrice={flight.price}
          businessPrice={flight.businessPrice}
          selectedClass={selectedClass}
          economySeatsLeft={flight.seatsAvailable}
          businessSeatsLeft={flight.businessSeatsAvailable}
        />

        <button
          onClick={() => onSelect(flight)}
          className={`flex items-center gap-2 px-6 py-2 rounded-md transition-colors ${
            isSelected 
              ? 'bg-sky-100 text-sky-700 hover:bg-sky-200'
              : 'bg-sky-600 text-white hover:bg-sky-700'
          }`}
          title={isSelected ? 'Click to unselect' : 'Select this flight'}
        >
          {isSelected ? (
            <>
              <Check className="h-5 w-5" />
              Selected
            </>
          ) : (
            'Select Flight'
          )}
        </button>
      </div>

      <FlightDetails
        duration={flight.duration}
        aircraft={flight.aircraft}
        baggage={flight.baggage}
        services={flight.services}
        selectedClass={selectedClass}
      />

      {classInfo.seatsLeft <= 4 && (
        <div className="mt-4 text-sm text-amber-600 flex items-center gap-1">
          <span className="font-medium">
            Only {classInfo.seatsLeft} {classInfo.seatsLeft === 1 ? 'seat' : 'seats'} left at this price!
          </span>
        </div>
      )}
    </div>
  );
}