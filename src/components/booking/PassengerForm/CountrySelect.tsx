import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { COUNTRIES } from '../../../constants/countries';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function CountrySelect({ value, onChange, error, disabled }: CountrySelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Country of Residence <span className="text-red-500">*</span>
      </label>
      <div className="relative">
        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          required
          className={`w-full pl-10 pr-8 py-2 border rounded-md appearance-none focus:ring-sky-500 focus:border-sky-500 ${
            error ? 'border-red-300' : 'border-gray-300'
          } ${disabled ? 'bg-gray-50 text-gray-500' : 'bg-white'}`}
        >
          <option value="">Select a country</option>
          {COUNTRIES.map(country => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDown className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}