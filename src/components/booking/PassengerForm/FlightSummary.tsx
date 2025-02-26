import React from 'react';
import { Flight, PassengerCount } from '../../../types/flight';
import { formatCurrency } from '../../../utils/formatting';

interface FlightSummaryProps {
  flight: Flight;
  passengerCount: PassengerCount;
  totalPrice: number;
}

export function FlightSummary({ flight, passengerCount, totalPrice }: FlightSummaryProps) {
  return (
    <div className="bg-sky-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Flight Summary</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-gray-600 text-sm">Flight</div>
            <div className="font-medium">{flight.id}</div>
          </div>
          
          <div>
            <div className="text-gray-600 text-sm">Route</div>
            <div className="font-medium">{flight.from} → {flight.to}</div>
          </div>
          
          <div>
            <div className="text-gray-600 text-sm">Date</div>
            <div className="font-medium">
              {new Date(flight.departureDate).toLocaleDateString()}
            </div>
          </div>
          
          <div>
            <div className="text-gray-600 text-sm">Time</div>
            <div className="font-medium">
              {new Date(flight.departureDate).toLocaleTimeString()} - 
              {new Date(flight.arrivalDate).toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="border-t border-sky-100 pt-4">
          <div className="text-gray-600 text-sm mb-2">Passengers</div>
          <div className="space-y-1">
            {passengerCount.adult > 0 && (
              <div className="flex justify-between">
                <span>{passengerCount.adult} Adult(s)</span>
                <span>{formatCurrency(passengerCount.adult * flight.price)}</span>
              </div>
            )}
            {passengerCount.child > 0 && (
              <div className="flex justify-between">
                <span>{passengerCount.child} Child(ren)</span>
                <span>{formatCurrency(passengerCount.child * flight.price)}</span>
              </div>
            )}
            {passengerCount.infant > 0 && (
              <div className="flex justify-between">
                <span>{passengerCount.infant} Infant(s)</span>
                <span>{formatCurrency(passengerCount.infant * (flight.price * 0.1))}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-sky-100 pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Price</span>
            <span className="text-xl font-bold text-sky-600">
              {formatCurrency(totalPrice)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}