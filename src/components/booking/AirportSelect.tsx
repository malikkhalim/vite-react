import React from 'react';
import { MapPin } from 'lucide-react';
import { AIRPORTS, AirportCode } from '../../constants/airports';

interface AirportSelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  disabled?: boolean;
  availableAirports?: AirportCode[];
  showAllAirports?: boolean;
}

export function AirportSelect({
  name,
  value,
  onChange,
  label,
  disabled = false,
  availableAirports,
  showAllAirports = false
}: AirportSelectProps) {
  const airports = showAllAirports 
    ? Object.keys(AIRPORTS) as AirportCode[]
    : availableAirports || [];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required
          className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
        >
          <option value="">Select Airport</option>
          {airports.map((code) => (
            <option key={code} value={code}>
              {AIRPORTS[code].city} ({code}) - {AIRPORTS[code].name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}