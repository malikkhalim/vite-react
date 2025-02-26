import React from 'react';
import { Users } from 'lucide-react';

export function PassengerInput() {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
      <div className="relative">
        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
        <input
          type="number"
          name="passengers"
          min="1"
          max="9"
          defaultValue="1"
          required
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-sky-500 focus:border-sky-500 appearance-none text-base sm:text-sm"
        />
      </div>
    </div>
  );
}