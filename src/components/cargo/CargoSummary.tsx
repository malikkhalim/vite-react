import React, { useState } from 'react';
import { Package, Truck } from 'lucide-react';
import { AddressLookup } from './AddressLookup';
import { CargoSummaryDetails } from './CargoSummaryDetails';
import { CargoAddOns } from './CargoAddOns';
import { ContactSummary } from './ContactSummary';
import type { CargoDetails, ContactDetails, CargoSummary as CargoSummaryType } from '../../types/cargo';
import { calculateCargoFees, calculatePickupFee } from '../../utils/cargo';

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

  const cargoFees = calculateCargoFees(cargoDetails.totalWeight);
  const pickupFee = needsPickup ? calculatePickupFee(cargoDetails.totalWeight) : 0;

  const totalAmount = Object.values(cargoFees).reduce((a, b) => a + b, 0) + pickupFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (needsPickup && (!pickupAddress || !pickupContact)) {
      return; // Form validation will handle the error
    }

    onContinue({
      cargoDetails,
      contactDetails,
      fees: cargoFees,
      pickup: needsPickup ? {
        address: pickupAddress,
        contact: pickupContact!,
        fee: pickupFee
      } : undefined,
      totalAmount
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
        {/* Cargo Summary */}
        <CargoSummaryDetails 
          cargoDetails={cargoDetails}
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
          <div className="flex justify-between items-center text-lg font-semibold">
            <span>Total Amount</span>
            <span className="text-2xl text-sky-600">
              ${totalAmount.toFixed(2)}
            </span>
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