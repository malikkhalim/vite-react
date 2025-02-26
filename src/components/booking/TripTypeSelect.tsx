import React from 'react';
import { Plane } from 'lucide-react';
import { TripType } from '../../types/flight';

interface TripTypeSelectProps {
  value: TripType;
  onChange: (value: TripType) => void;
}

export function TripTypeSelect({ value, onChange }: TripTypeSelectProps) {
  return (
    <div className="flex gap-4 p-2 bg-gray-50 rounded-lg">
      <button
        type="button"
        onClick={() => onChange('one-way')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
          value === 'one-way'
            ? 'bg-sky-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <Plane className="h-4 w-4" />
        One Way
      </button>
      <button
        type="button"
        onClick={() => onChange('return')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
          value === 'return'
            ? 'bg-sky-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
      >
        <div className="flex gap-1">
          <Plane className="h-4 w-4" />
          <Plane className="h-4 w-4 rotate-180" />
        </div>
        Return
      </button>
    </div>
  );
}