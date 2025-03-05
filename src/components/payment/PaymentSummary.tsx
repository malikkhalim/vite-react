import React from 'react';
import { formatCurrency } from '../../utils/formatting';
import { Flight, PassengerCount } from '../../types/flight';
import { formatDate, formatTime, formatDuration } from '../../utils/dates';
import { Plane, Clock, User, Luggage, Receipt, CreditCard } from 'lucide-react';

interface PaymentSummaryProps {
  amount: number;
  passengers: PassengerCount;
  flightPrice: number;
  flight?: Flight;
  returnFlight?: Flight | null;
  className?: string;
}

export function PaymentSummary({ 
  amount, 
  passengers, 
  flightPrice, 
  flight,
  returnFlight,
  className 
}: PaymentSummaryProps) {
  // Calculate passenger totals
  const adultTotal = passengers.adult * flightPrice;
  const childTotal = passengers.child * flightPrice;
  const infantTotal = passengers.infant * (flightPrice * 0.1); // 10% of adult fare
  
  // Calculate fees (approximation)
  const airportTax = Math.round(amount * 0.06);
  const fuelSurcharge = Math.round(amount * 0.04);
  const serviceCharge = Math.round(amount * 0.02);
  const insuranceFee = Math.round(amount * 0.01);
  
  // Calculate total fees
  const totalFees = airportTax + fuelSurcharge + serviceCharge + insuranceFee;
  
  // Calculate base fare (without fees)
  const baseFare = amount - totalFees;

  return (
    <div className={`bg-white rounded-lg shadow-md ${className || ''}`}>
      {/* Flight Section */}
      {flight && (
        <div className="border-b border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plane className="h-5 w-5 text-sky-600" />
            Flight Details
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-semibold flex items-center gap-2">
                  <span>{flight.from}</span>
                  <Plane className="h-4 w-4 text-gray-400" />
                  <span>{flight.to}</span>
                </div>
                <div className="text-gray-500 text-sm">
                  {formatDate(flight.departureDate)}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-gray-500">Flight Duration</div>
                <div className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  {formatDuration(flight.duration)}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{formatTime(flight.departureDate)}</div>
                <div className="text-sm text-gray-500">{flight.from}</div>
              </div>
              
              <div className="text-right">
                <div className="font-medium">{formatTime(flight.arrivalDate)}</div>
                <div className="text-sm text-gray-500">{flight.to}</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded flex justify-between text-sm">
              <span>Flight {flight.id}</span>
              <span>{flight.aircraft}</span>
            </div>
          </div>
          
          {/* Return Flight */}
          {returnFlight && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plane className="h-5 w-5 text-sky-600 transform rotate-180" />
                Return Flight
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-semibold flex items-center gap-2">
                      <span>{returnFlight.from}</span>
                      <Plane className="h-4 w-4 text-gray-400" />
                      <span>{returnFlight.to}</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                      {formatDate(returnFlight.departureDate)}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Flight Duration</div>
                    <div className="font-medium flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formatDuration(returnFlight.duration)}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{formatTime(returnFlight.departureDate)}</div>
                    <div className="text-sm text-gray-500">{returnFlight.from}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">{formatTime(returnFlight.arrivalDate)}</div>
                    <div className="text-sm text-gray-500">{returnFlight.to}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded flex justify-between text-sm">
                  <span>Flight {returnFlight.id}</span>
                  <span>{returnFlight.aircraft}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Fare Breakdown Section */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Receipt className="h-5 w-5 text-sky-600" />
          Fare Breakdown
        </h3>
        
        <div className="space-y-6">
          {/* Passenger Fare */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              Passenger Fare
            </h4>
            
            <div className="space-y-2">
              {passengers.adult > 0 && (
                <div className="flex justify-between text-sm">
                  <span>{passengers.adult} × Adult</span>
                  <span>{formatCurrency(adultTotal)}</span>
                </div>
              )}
              
              {passengers.child > 0 && (
                <div className="flex justify-between text-sm">
                  <span>{passengers.child} × Child</span>
                  <span>{formatCurrency(childTotal)}</span>
                </div>
              )}
              
              {passengers.infant > 0 && (
                <div className="flex justify-between text-sm">
                  <span>{passengers.infant} × Infant</span>
                  <span>{formatCurrency(infantTotal)}</span>
                </div>
              )}
              
              <div className="flex justify-between font-medium pt-2 border-t border-gray-100">
                <span>Base Fare Total</span>
                <span>{formatCurrency(baseFare)}</span>
              </div>
            </div>
          </div>
          
          {/* Fees & Taxes */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Luggage className="h-4 w-4 text-gray-400" />
              Fees & Taxes
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Airport Tax</span>
                <span>{formatCurrency(airportTax)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Fuel Surcharge</span>
                <span>{formatCurrency(fuelSurcharge)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Service Charge</span>
                <span>{formatCurrency(serviceCharge)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Insurance Fee</span>
                <span>{formatCurrency(insuranceFee)}</span>
              </div>
              
              <div className="flex justify-between font-medium pt-2 border-t border-gray-100">
                <span>Fees & Taxes Total</span>
                <span>{formatCurrency(totalFees)}</span>
              </div>
            </div>
          </div>
          
          {/* Baggage Allowance */}
          {flight && (
            <div className="bg-sky-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Luggage className="h-4 w-4 text-sky-600" />
                Baggage Allowance
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Adults & Children</span>
                  <span>{flight.baggage.economy}kg per passenger</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Infants</span>
                  <span>10kg per infant</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Payment Total */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-sky-600" />
              Payment Summary
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Base Fare Total</span>
                <span>{formatCurrency(baseFare)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Fees & Taxes</span>
                <span>{formatCurrency(totalFees)}</span>
              </div>
              
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                <span>Grand Total</span>
                <span className="text-sky-600">{formatCurrency(amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}