import React, { useState, useEffect } from 'react';
import { Package, Truck, AlertCircle, Edit2 } from 'lucide-react';
import { AddressLookup } from './AddressLookup';
import { CargoSummaryDetails } from './CargoSummaryDetails';
import { CargoAddOns } from './CargoAddOns';
import { ContactSummary } from './ContactSummary';
import { useCargoCalculations } from '../../hooks/useCargoCalculations';
import type { CargoDetails, ContactDetails, CargoSummary as CargoSummaryType } from '../../types/cargo';

interface CargoSummaryProps {
  cargoDetails: CargoDetails;
  contactDetails: {
    shipper: ContactDetails;
    consignee: ContactDetails;
  };
  onContinue: (summary: CargoSummaryType) => void;
  isAdmin?: boolean; // New prop to enable admin features
}

export function CargoSummary({ 
  cargoDetails, 
  contactDetails, 
  onContinue,
  isAdmin = false
}: CargoSummaryProps) {
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupContact, setPickupContact] = useState<{ name: string; phone: string } | null>(null);
  const [needsPickup, setNeedsPickup] = useState(false);
  const [editingFees, setEditingFees] = useState(false);

  // State for manually adjusted fees (admin only)
  const [manualFees, setManualFees] = useState({
    awbFee: 0,
    screeningFeePerKg: 0,
    handlingFeePerKg: 0,
    cargoChargePerKg: 0
  });

  const {
    calculateTotalWeight,
    calculateTotalVolume,
    calculateCargoFees,
    calculatePickupFee,
    getRoutePricing,
    settings,
    isLoading,
    error
  } = useCargoCalculations();
  
  // Calculate correct volume based on the specified formula: WxHxL/60001
  const calculateCorrectVolume = (packages: CargoDetails['packages']): number => {
    return packages.reduce((total, pkg) => {
      if (!pkg.dimensions || !pkg.quantity) return total;
      const { length, width, height } = pkg.dimensions;
      if (!length || !width || !height) return total;
      
      // Using the specified formula: WxHxL/60001
      const volumePerPackage = (width * height * length) / 60001;
      return total + (volumePerPackage * pkg.quantity);
    }, 0);
  };
  
  // Calculate weights and volumes
  const totalWeight = calculateTotalWeight(cargoDetails.packages);
  const totalVolume = calculateCorrectVolume(cargoDetails.packages);
  
  // Initialize manual fees from settings when they load
  useEffect(() => {
    if (settings) {
      setManualFees({
        awbFee: settings.cargoFees.awbFee,
        screeningFeePerKg: settings.cargoFees.screeningFeePerKg,
        handlingFeePerKg: settings.cargoFees.handlingFeePerKg,
        cargoChargePerKg: settings.cargoFees.cargoChargePerKg
      });
    }
  }, [settings]);
  
  // Calculate fees - use manual fees if editing is enabled (admin mode)
  const cargoFees = editingFees ? 
    {
      awbFee: manualFees.awbFee,
      screeningFee: manualFees.screeningFeePerKg * totalWeight,
      handlingFee: manualFees.handlingFeePerKg * totalWeight,
      cargoCharge: manualFees.cargoChargePerKg * totalWeight
    } : 
    calculateCargoFees(totalWeight);
  
  // Determine if pickup service is available (only from SIN or DIL)
  const isPickupAvailable = cargoDetails.from === 'SIN' || cargoDetails.from === 'DIL';
  
  // Calculate pickup fee if needed
  const pickupFee = (needsPickup && isPickupAvailable) ? calculatePickupFee(totalWeight) : 0;
  
  // Calculate any route-based pricing
  const routeFee = settings ? 
    getRoutePricing(cargoDetails.from, cargoDetails.to, cargoDetails.cargoType) : 0;
  
  // Determine currency based on origin
  const currency = cargoDetails.from === 'SIN' ? 'SGD' : 'USD';
  
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
      pickup: needsPickup && isPickupAvailable ? {
        address: pickupAddress,
        contact: pickupContact!,
        fee: pickupFee
      } : undefined,
      routeFee,
      totalAmount,
      currency // Add currency to the summary
    });
  };

  // Handle manual fee changes (admin only)
  const handleFeeChange = (fee: keyof typeof manualFees, value: string) => {
    if (!isAdmin) return;
    
    const numValue = parseFloat(value) || 0;
    setManualFees(prev => ({
      ...prev,
      [fee]: numValue
    }));
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

  // Show error state if there was a problem loading settings
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error loading settings: </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2">Using default values for calculations.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
        {/* Admin Controls */}
        {isAdmin && (
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-purple-800">Admin Fee Controls</h3>
              <button
                type="button"
                onClick={() => setEditingFees(!editingFees)}
                className="text-purple-700 hover:text-purple-900 flex items-center gap-1"
              >
                <Edit2 className="h-4 w-4" />
                {editingFees ? 'Done Editing' : 'Edit Fees'}
              </button>
            </div>
            
            {editingFees && (
              <div className="mt-4 grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    AWB Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {currency === 'SGD' ? 'S$' : '$'}
                    </span>
                    <input
                      type="number"
                      value={manualFees.awbFee}
                      onChange={(e) => handleFeeChange('awbFee', e.target.value)}
                      step="0.01"
                      min="0"
                      className="pl-8 pr-4 py-2 border border-purple-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Screening Fee (per kg)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {currency === 'SGD' ? 'S$' : '$'}
                    </span>
                    <input
                      type="number"
                      value={manualFees.screeningFeePerKg}
                      onChange={(e) => handleFeeChange('screeningFeePerKg', e.target.value)}
                      step="0.01"
                      min="0"
                      className="pl-8 pr-4 py-2 border border-purple-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Handling Fee (per kg)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {currency === 'SGD' ? 'S$' : '$'}
                    </span>
                    <input
                      type="number"
                      value={manualFees.handlingFeePerKg}
                      onChange={(e) => handleFeeChange('handlingFeePerKg', e.target.value)}
                      step="0.01"
                      min="0"
                      className="pl-8 pr-4 py-2 border border-purple-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Cargo Charge (per kg)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      {currency === 'SGD' ? 'S$' : '$'}
                    </span>
                    <input
                      type="number"
                      value={manualFees.cargoChargePerKg}
                      onChange={(e) => handleFeeChange('cargoChargePerKg', e.target.value)}
                      step="0.01"
                      min="0"
                      className="pl-8 pr-4 py-2 border border-purple-300 rounded-md w-full focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cargo Summary */}
        <CargoSummaryDetails 
          cargoDetails={{
            ...cargoDetails,
            totalWeight,
            totalVolume
          }}
          fees={cargoFees}
          settings={settings}
          currency={currency}
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
            isPickupAvailable={isPickupAvailable}
          />

          {needsPickup && isPickupAvailable && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="mb-2 text-sm text-gray-600">
                Pickup fee: {currency === 'SGD' ? 'S$' : '$'}{settings?.pickupService.basePrice.toFixed(2)} base (up to {settings?.pickupService.baseWeight}kg) + 
                {currency === 'SGD' ? 'S$' : '$'}{settings?.pickupService.additionalPricePerKg.toFixed(2)}/kg over {settings?.pickupService.baseWeight}kg
              </p>
              <AddressLookup
                value={pickupAddress}
                onChange={setPickupAddress}
                onContactChange={setPickupContact}
              />
            </div>
          )}
          
          {!isPickupAvailable && needsPickup && (
            <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  Pickup service is only available for shipments from Singapore (SIN) or Dili (DIL).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Total Amount */}
        <div className="border-t pt-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cargo Fees Total:</span>
              <span className="text-lg font-medium">
                {currency === 'SGD' ? 'S$' : '$'}{baseTotalAmount.toFixed(2)}
              </span>
            </div>
            
            {needsPickup && isPickupAvailable && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pickup Service:</span>
                <span className="text-lg font-medium">
                  {currency === 'SGD' ? 'S$' : '$'}{pickupFee.toFixed(2)}
                </span>
              </div>
            )}
            
            {routeFee > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">
                  Route Fee ({cargoDetails.from} to {cargoDetails.to}):
                </span>
                <span className="text-lg font-medium">
                  {currency === 'SGD' ? 'S$' : '$'}{routeFee.toFixed(2)}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center border-t pt-2 mt-2">
              <span className="font-semibold">Total Amount:</span>
              <span className="text-2xl text-sky-600 font-bold">
                {currency === 'SGD' ? 'S$' : '$'}{totalAmount.toFixed(2)}
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