import React from 'react';
import { formatCurrency } from '../../utils/formatting';

interface PaymentSummaryProps {
  amount: number;
  passengers: {
    adult: number;
    child: number;
    infant: number;
  };
  flightPrice: number;
}

export function PaymentSummary({ amount, passengers, flightPrice }: PaymentSummaryProps) {
  const adultTotal = passengers.adult * flightPrice;
  const childTotal = passengers.child * flightPrice;
  const infantTotal = passengers.infant * (flightPrice * 0.1); // 10% of adult fare

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Flight Summary</h3>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h4 className="font-medium mb-2">Passenger Breakdown</h4>
          
          {passengers.adult > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span>{passengers.adult} x Adult</span>
              <span>{formatCurrency(adultTotal)}</span>
            </div>
          )}
          
          {passengers.child > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span>{passengers.child} x Child</span>
              <span>{formatCurrency(childTotal)}</span>
            </div>
          )}
          
          {passengers.infant > 0 && (
            <div className="flex justify-between text-sm mb-1">
              <span>{passengers.infant} x Infant</span>
              <span>{formatCurrency(infantTotal)}</span>
            </div>
          )}
        </div>
        
        <div className="border-b pb-4">
          <h4 className="font-medium mb-2">Fees & Taxes</h4>
          <div className="flex justify-between text-sm">
            <span>Airport tax, fuel surcharges & fees</span>
            <span>{formatCurrency(amount * 0.15)}</span>
          </div>
        </div>
        
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCurrency(amount)}</span>
        </div>
      </div>
    </div>
  );
}