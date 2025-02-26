import React from 'react';
import { Plane } from 'lucide-react';
import { AirportDisplay } from './AirportDisplay';
import { AirportCode } from '../../constants/airports';
import { formatTime } from '../../utils/dates';

interface FlightRouteProps {
  from: AirportCode;
  to: AirportCode;
  departureTime: string;
  arrivalTime: string;
}

export function FlightRoute({ from, to, departureTime, arrivalTime }: FlightRouteProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{formatTime(departureTime)}</span>
        <AirportDisplay code={from} />
      </div>
      <Plane className="h-6 w-6 text-sky-600" />
      <div className="flex flex-col">
        <span className="text-lg font-semibold">{formatTime(arrivalTime)}</span>
        <AirportDisplay code={to} />
      </div>
    </div>
  );
}