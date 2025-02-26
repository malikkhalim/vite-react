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
  // Calculate individual amounts
  const adultAmount = passengers.adult * flightPrice;
  const childAmount = passengers.child * flightPrice;
  const infantAmount = passengers.infant * (flightPrice * 0.1); // 10% of adult fare
  const totalAmount = adultAmount + childAmount + infantAmount;

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Payment Summary</h3>
      
      <div className="space-y-3">
        {passengers.adult > 0 && (
          <div className="flex justify-between">
            <span>Adult × {passengers.adult}</span>
            <span>{formatCurrency(adultAmount)}</span>
          </div>
        )}
        
        {passengers.child > 0 && (
          <div className="flex justify-between">
            <span>Child × {passengers.child}</span>
            <span>{formatCurrency(childAmount)}</span>
          </div>
        )}
        
        {passengers.infant > 0 && (
          <div className="flex justify-between">
            <span>Infant × {passengers.infant}</span>
            <span>{formatCurrency(infantAmount)}</span>
          </div>
        )}

        <div className="border-t pt-3 font-semibold">
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="text-sky-600 text-lg">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}