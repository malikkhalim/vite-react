import React from 'react';
import { Package } from 'lucide-react';
import type { CargoDetails, CargoFees } from '../../types/cargo';
import { formatWeight, formatVolume, formatCurrency } from '../../utils/cargo/formatting';

interface CargoSummaryDetailsProps {
  cargoDetails: CargoDetails;
  fees: CargoFees;
}

export function CargoSummaryDetails({ cargoDetails, fees }: CargoSummaryDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Package className="h-5 w-5" />
        Cargo Summary
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Route Details */}
        <div>
          <h4 className="font-medium mb-2">Route Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">From:</span>
              <span>{cargoDetails.from}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">To:</span>
              <span>{cargoDetails.to}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span>{new Date(cargoDetails.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Cargo Details */}
        <div>
          <h4 className="font-medium mb-2">Cargo Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="capitalize">{cargoDetails.cargoType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Weight:</span>
              <span>{formatWeight(cargoDetails.totalWeight)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Volume:</span>
              <span>{formatVolume(cargoDetails.totalVolume)}</span>
            </div>
          </div>
        </div>

        {/* Fees Breakdown */}
        <div className="col-span-2">
          <h4 className="font-medium mb-2">Fees Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">AWB Fee:</span>
              <span>{formatCurrency(fees.awbFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Screening Fee:</span>
              <span>{formatCurrency(fees.screeningFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Handling Fee:</span>
              <span>{formatCurrency(fees.handlingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cargo Charge:</span>
              <span>{formatCurrency(fees.cargoCharge)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}