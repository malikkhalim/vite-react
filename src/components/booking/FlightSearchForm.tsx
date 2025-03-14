import React, { useState } from 'react';
import { AirportSelect } from './AirportSelect';
import { DateSelect } from './DateSelect';
import { PassengerTypeSelect } from './PassengerTypeSelect';
import { TripTypeSelect } from './TripTypeSelect';
import { ErrorMessage } from '../ui/ErrorMessage';
import { validateDates } from '../../utils/validation/dates';
import type { BookingFormData } from '../../types/flight';
import type { AirportCode } from '../../types/airport';

interface FlightSearchFormProps {
  onSearch: (data: BookingFormData) => void;
}

export function FlightSearchForm({ onSearch }: FlightSearchFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [dateErrors, setDateErrors] = useState<{
    departureDate?: string;
    returnDate?: string;
  }>({});

  const [formData, setFormData] = useState<BookingFormData>({
    from: '' as AirportCode,
    to: '' as AirportCode,
    departureDate: '',
    returnDate: '',
    passengers: {
      adult: 1,
      child: 0,
      infant: 0
    },
    class: 'economy',
    tripType: 'one-way'
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setDateErrors({});

    // Validate from/to selection
    if (formData.from === formData.to && formData.from !== '') {
      setError('Origin and destination cannot be the same');
      return;
    }

    // Validate dates
    const dateValidationErrors = validateDates(formData.departureDate, formData.returnDate, formData.tripType);
    if (dateValidationErrors) {
      setDateErrors(dateValidationErrors);
      return;
    }

    // Make sure onSearch is a function before calling it
    if (typeof onSearch === 'function') {
      onSearch(formData);
    } else {
      console.error('onSearch is not a function:', onSearch);
      setError('Internal error: Search handler is not properly configured');
    }
  };

  const handleTripTypeChange = (tripType: 'one-way' | 'return') => {
    setFormData(prev => ({
      ...prev,
      tripType,
      returnDate: tripType === 'one-way' ? '' : prev.returnDate
    }));
    setDateErrors({});
  };

  const handleDateChange = (field: 'departureDate' | 'returnDate') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setFormData(prev => ({ ...prev, [field]: newDate }));
    
    // Clear date errors when user changes dates
    setDateErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
      {error && <ErrorMessage message={error} />}

      <TripTypeSelect 
        value={formData.tripType} 
        onChange={handleTripTypeChange} 
      />

      <div className="grid md:grid-cols-2 gap-4">
        <AirportSelect
          name="from"
          value={formData.from}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            from: e.target.value as AirportCode,
            to: e.target.value === prev.to ? '' as AirportCode : prev.to
          }))}
          label="From"
          isOrigin={true}
        />

        <AirportSelect
          name="to"
          value={formData.to}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            to: e.target.value as AirportCode 
          }))}
          label="To"
          disabled={!formData.from}
          originValue={formData.from}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <DateSelect
          label="Departure Date"
          name="departureDate"
          value={formData.departureDate}
          onChange={handleDateChange('departureDate')}
          error={dateErrors.departureDate}
        />

        {formData.tripType === 'return' && (
          <DateSelect
            label="Return Date"
            name="returnDate"
            value={formData.returnDate}
            onChange={handleDateChange('returnDate')}
            minDate={formData.departureDate}
            error={dateErrors.returnDate}
          />
        )}
      </div>

      <PassengerTypeSelect
        value={formData.passengers}
        onChange={(passengers) => setFormData(prev => ({ 
          ...prev, 
          passengers 
        }))}
      />

      <button
        type="submit"
        className="w-full bg-sky-600 text-white py-3 rounded-md hover:bg-sky-700 transition-colors font-medium"
      >
        Search Flights
      </button>
    </form>
  );
}