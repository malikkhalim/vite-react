import React from 'react';
import { Clock, Luggage, Plane, Armchair, Sofa } from 'lucide-react';
import { formatDuration } from '../../utils/dates';
import { FlightClass } from '../../types/flight';

interface FlightDetailsProps {
  duration: number; // in minutes
  aircraft: string;
  baggage: {
    economy: number;
    business: number;
  };
  services: {
    economy: string[];
    business: string[];
  };
  selectedClass: FlightClass;
}

export function FlightDetails({ 
  duration, 
  aircraft, 
  baggage, 
  services,
  selectedClass 
}: FlightDetailsProps) {
  const allowedBaggage = selectedClass === 'business' ? baggage.business : baggage.economy;
  const classServices = selectedClass === 'business' ? services.business : services.economy;
  const SeatIcon = selectedClass === 'business' ? Sofa : Armchair;

  return (
    <div className="mt-4 grid grid-cols-3 gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>Duration: {formatDuration(duration)}</span>
      </div>
      <div className="flex items-center gap-2">
        <Plane className="h-4 w-4" />
        <span>Aircraft: {aircraft}</span>
      </div>
      <div className="flex items-center gap-2">
        <Luggage className="h-4 w-4" />
        <span>Baggage: {allowedBaggage}kg</span>
      </div>
      <div className="col-span-3">
        <div className="flex items-center gap-2 mb-2">
          <SeatIcon className="h-4 w-4" />
          <h4 className="font-medium text-gray-700">
            {selectedClass === 'business' ? 'Business Class' : 'Economy Class'} Services:
          </h4>
        </div>
        <ul className="list-disc list-inside space-y-1 pl-4">
          {classServices.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}