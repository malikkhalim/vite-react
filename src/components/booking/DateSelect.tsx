import React from 'react';
import { Calendar } from 'lucide-react';

interface DateSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  minDate?: string;
  required?: boolean;
  testMode?: boolean;
  error?: string;
  helperText?: string;
}

export function DateSelect({ 
  label, 
  name, 
  value, 
  onChange, 
  minDate,
  required = true,
  testMode = false,
  error,
  helperText
}: DateSelectProps) {
  const currentDate = new Date().toISOString().split('T')[0];
  const effectiveMinDate = testMode ? undefined : (minDate || currentDate);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        <input
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          min={effectiveMinDate}
          className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-sky-500 focus:border-sky-500 appearance-none text-base sm:text-sm ${
            error ? 'border-red-300' : 'border-gray-300'
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}