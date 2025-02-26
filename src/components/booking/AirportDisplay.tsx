import React from 'react';
import { AIRPORTS, AirportCode } from '../../constants/airports';

interface AirportDisplayProps {
  code: AirportCode;
  showDetails?: boolean;
}

export function AirportDisplay({ code, showDetails = false }: AirportDisplayProps) {
  const airport = AIRPORTS[code];
  
  if (!showDetails) {
    return (
      <span>
        {airport.city} ({code})
      </span>
    );
  }

  return (
    <div>
      <div className="font-semibold">{airport.city} ({code})</div>
      <div className="text-sm text-gray-600">{airport.name}</div>
      <div className="text-sm text-gray-500">{airport.country}</div>
    </div>
  );
}