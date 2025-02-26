import React from 'react';
import { Calendar } from 'lucide-react';

export function DateInput() {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="date"
          name="departureDate"
          required
          min={new Date().toISOString().split('T')[0]}
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-sky-500 focus:border-sky-500"
        />
      </div>
    </div>
  );
}