import React from 'react';
import { MapPin } from 'lucide-react';
import type { AirportCode } from '../../types/airport';
import { useRoutes } from '../../hooks/useRoutes';

interface AirportSelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  label: string;
  disabled?: boolean;
  isOrigin?: boolean;
  originValue?: AirportCode;
}

export function AirportSelect({
  name,
  value,
  onChange,
  label,
  disabled = false,
  isOrigin = false,
  originValue
}: AirportSelectProps) {
  const { loading, error, airports, getDestinationsFor } = useRoutes();
  
  // Determine which airports to show
  const availableAirports = isOrigin || !originValue
    ? airports
    : airports.filter(airport => getDestinationsFor(originValue).includes(airport.code));

  // Loading state
  if (loading) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
          <select
            disabled
            className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
          >
            <option>Loading airports...</option>
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
  
  // Error state
  if (error) {
    console.error('Error loading airports:', error);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled || availableAirports.length === 0}
          required
          className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
        >
          <option value="">Select Airport</option>
          {availableAirports.map((airport) => (
            <option key={airport.code} value={airport.code}>
              {airport.city} ({airport.code}) - {airport.name}
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