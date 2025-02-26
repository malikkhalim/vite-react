import React from 'react';
import { Armchair, Sofa } from 'lucide-react';
import { FlightClass } from '../../types/flight';

interface ClassSelectProps {
  value: FlightClass;
  onChange: (value: FlightClass) => void;
}

export function ClassSelect({ value, onChange }: ClassSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Travel Class</label>
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => onChange('economy')}
          className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
            value === 'economy'
              ? 'border-sky-600 bg-sky-50 text-sky-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Armchair className="h-6 w-6" />
          <span className="font-medium">Economy</span>
          <span className="text-sm text-gray-500">Standard seating</span>
        </button>

        <button
          type="button"
          onClick={() => onChange('business')}
          className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
            value === 'business'
              ? 'border-sky-600 bg-sky-50 text-sky-700'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <Sofa className="h-6 w-6" />
          <span className="font-medium">Business</span>
          <span className="text-sm text-gray-500">Premium experience</span>
        </button>
      </div>
    </div>
  );
}