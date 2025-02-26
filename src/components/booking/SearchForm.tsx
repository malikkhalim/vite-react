import React, { useState, useMemo } from 'react';
import { Calendar, MapPin, AlertCircle } from 'lucide-react';
import { BookingFormData } from '../../types/flight';
import { validateFlightSearch } from '../../utils/validation';

interface SearchFormProps {
  onSearch: (data: BookingFormData) => void;
}

const ROUTES = {
  'Dili': ['Darwin', 'Bali', 'Singapore'],
  'Darwin': ['Dili', 'Singapore'],
  'Bali': ['Dili', 'Singapore'],
  'Singapore': ['Dili', 'Darwin', 'Bali']
};

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const availableDestinations = useMemo(() => {
    if (!from) return [];
    return ROUTES[from as keyof typeof ROUTES] || [];
  }, [from]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fromValue = formData.get('from') as string;
    const toValue = formData.get('to') as string;
    
    const validationError = validateFlightSearch(fromValue, toValue);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    onSearch({
      from: fromValue,
      to: toValue,
      departureDate: formData.get('departureDate') as string,
      passengers: parseInt(formData.get('passengers') as string, 10)
    });
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFrom = e.target.value;
    setFrom(newFrom);
    setTo(''); // Reset destination when origin changes
    setError(null);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTo(e.target.value);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              name="from"
              value={from}
              onChange={handleFromChange}
              required
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">Select Origin</option>
              {Object.keys(ROUTES).map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              name="to"
              value={to}
              onChange={handleToChange}
              required
              disabled={!from}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-sky-500 focus:border-sky-500 disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option value="">Select Destination</option>
              {availableDestinations.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
          <input
            type="number"
            name="passengers"
            min="1"
            max="9"
            defaultValue="1"
            required
            className="px-4 py-2 border border-gray-300 rounded-md w-full focus:ring-sky-500 focus:border-sky-500"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="w-full bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 transition-colors"
        >
          Search Flights
        </button>
      </div>
    </form>
  );
}