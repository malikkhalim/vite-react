import React from 'react';
import { Truck } from 'lucide-react';

interface CargoAddOnsProps {
  needsPickup: boolean;
  onPickupChange: (value: boolean) => void;
}

export function CargoAddOns({ needsPickup, onPickupChange }: CargoAddOnsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Additional Services</h3>
      
      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={needsPickup}
            onChange={(e) => onPickupChange(e.target.checked)}
            className="mt-1"
          />
          <div>
            <div className="font-medium flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Pickup Service
            </div>
            <p className="text-sm text-gray-600">
              We'll collect your cargo from your location
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}