import React from 'react';
import { Armchair, Sofa } from 'lucide-react';
import { FlightClass } from '../../types/flight';
import { formatCurrency } from '../../utils/formatting';

interface FlightPriceProps {
  economyPrice: number;
  businessPrice: number;
  selectedClass: FlightClass;
  economySeatsLeft: number;
  businessSeatsLeft: number;
}

export function FlightPrice({ 
  economyPrice, 
  businessPrice, 
  selectedClass,
  economySeatsLeft,
  businessSeatsLeft
}: FlightPriceProps) {
  const price = selectedClass === 'business' ? businessPrice : economyPrice;
  const seatsLeft = selectedClass === 'business' ? businessSeatsLeft : economySeatsLeft;
  const Icon = selectedClass === 'business' ? Sofa : Armchair;

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="text-right">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-sky-600" />
          <span className="text-lg font-semibold text-sky-600">
            {formatCurrency(price)}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          {selectedClass === 'business' ? 'Business Class' : 'Economy Class'}
        </div>
      </div>
      
      {seatsLeft <= 4 && (
        <div className="text-sm text-amber-600">
          Only {seatsLeft} {seatsLeft === 1 ? 'seat' : 'seats'} left
        </div>
      )}
    </div>
  );
}