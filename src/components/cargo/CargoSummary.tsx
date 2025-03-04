import React, { useState } from 'react';
import { Package, Truck } from 'lucide-react';
import { AddressLookup } from './AddressLookup';
import { CargoSummaryDetails } from './CargoSummaryDetails';
import { CargoAddOns } from './CargoAddOns';
import { ContactSummary } from './ContactSummary';
import type { CargoDetails, ContactDetails, CargoSummary as CargoSummaryType } from '../../types/cargo';
import { useCargoFees } from '../../hooks/useCargoFees';
import { calculateTotalWeight, calculateTotalVolume, getRoutePricing } from '../../utils/cargo/calculations';

interface CargoSummaryProps {
  cargoDetails: CargoDetails;
  contactDetails: {
    shipper: ContactDetails;
    consignee: ContactDetails;
  };
  onContinue: (summary: CargoSummaryType) => void;
}

export function CargoSummary({ cargoDetails, contactDetails, onContinue }: CargoSummaryProps) {
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupContact, setPickupContact] = useState<{ name: string; phone: string } | null>(null);
  const [needsPickup, setNeedsPickup] = useState(false);

  const { calculateCargoFees, calculatePickupFee, settings, isLoading } = useCargoFees();
  
  // Calculate weights and volumes
  const totalWeight = calculateTotalWeight(cargoDetails.packages);
  const totalVolume = calculateTotalVolume(cargoDetails.packages);
  
  // Calculate fees based on admin settings
  const cargoFees = calculateCargoFees(totalWeight);
  const pickupFee = needsPickup ? calculatePickupFee(totalWeight) : 0;
  
  // Calculate any route-based pricing
  const routeFee = settings ? 
    getRoutePricing(cargoDetails.from, cargoDetails.to, cargoDetails.cargoType, settings) : 0;
  
  // Calculate total amount
  const baseTotalAmount = Object.values(cargoFees).reduce((a, b) => a + b, 0);
  const totalAmount = baseTotalAmount + pickupFee + routeFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (needsPickup && (!pickupAddress || !pickupContact)) {
      return; // Form validation will handle the error
    }

    // Update the cargoDetails with calculated weight and volume
    const enrichedCargoDetails = {
      ...cargoDetails,
      totalWeight,
      totalVolume
    };

    onContinue({
      cargoDetails: enrichedCargoDetails,
      contactDetails,
      fees: cargoFees,
      pickup: needsPickup ? {
        address: pickupAddress,
        contact: pickupContact!,
        fee: pickupFee
      } : undefined,
      routeFee,
      totalAmount
    });
  };

  // Show loading state if admin settings are loading
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        </div>
        <p className="text-center text-gray-600">Loading cargo fee settings...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
        {/* Cargo Summary */}
        <CargoSummaryDetails 
          cargoDetails={{
            ...cargoDetails,
            totalWeight,
            totalVolume
          }}
          fees={cargoFees}
        />

        {/* Contact Details Summary */}
        <div className="border-t pt-6">
          <ContactSummary
            shipper={contactDetails.shipper}
            consignee={contactDetails.consignee}
          />
        </div>

        {/* Add-on Services */}
        <div className="border-t pt-6">
          <CargoAddOns
            needsPickup={needsPickup}
            onPickupChange={setNeedsPickup}
          />

          {needsPickup && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="mb-2 text-sm text-gray-600">
                Pickup fee: ${settings?.pickupService.basePrice.toFixed(2)} base (up to {settings?.pickupService.baseWeight}kg) + 
                ${settings?.pickupService.additionalPricePerKg.toFixed(2)}/kg over {settings?.pickupService.baseWeight}kg
              </p>
              <AddressLookup
                value={pickupAddress}
                onChange={setPickupAddress}
                onContactChange={setPickupContact}
              />
            </div>
          )}
        </div>

        {/* Total Amount */}
        <div className="border-t pt-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cargo Fees Total:</span>
              <span className="text-lg font-medium">${baseTotalAmount.toFixed(2)}</span>
            </div>
            
            {needsPickup && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pickup Service:</span>
                <span className="text-lg font-medium">${pickupFee.toFixed(2)}</span>
              </div>
            )}
            
            {routeFee > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Route Fee:</span>
                <span className="text-lg font-medium">${routeFee.toFixed(2)}</span>
              </div>
            )}
            
            <div className="flex justify-between items-center border-t pt-2 mt-2">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-2xl text-sky-600 font-bold">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-sky-600 text-white px-8 py-3 rounded-md hover:bg-sky-700 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </form>
  );
}