import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SalutationSelectProps {
  value: string;
  onChange: (value: string) => void;
  type: 'adult' | 'child' | 'infant';
}

export function SalutationSelect({ value, onChange, type }: SalutationSelectProps) {
  const options = type === 'adult' 
    ? ['Mr', 'Mrs', 'Ms', 'Dr'] 
    : ['Mstr', 'Miss'];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Title
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          required
        >
          <option value="">Select</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}