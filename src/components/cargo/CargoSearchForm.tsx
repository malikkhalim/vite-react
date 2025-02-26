import React, { useState, useEffect } from 'react';
import { AirportSelect } from '../booking/AirportSelect';
import { DateSelect } from '../booking/DateSelect';
import { ErrorMessage } from '../ui/ErrorMessage';
import { validateCargoRoute, getAvailableCargoDestinations } from '../../constants/routes';
import { getNextAvailableDate, isValidCargoDate, getScheduleDescription } from '../../utils/cargo/date-validation';
import { CargoSearchData } from '../../types/cargo';
import { format } from 'date-fns';

interface CargoSearchFormProps {
  onSearch: (data: CargoSearchData) => void;
}

export function CargoSearchForm({ onSearch }: CargoSearchFormProps) {
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [nextAvailableDate, setNextAvailableDate] = useState<Date | null>(null);

  const availableOrigins = ['SIN', 'DIL'];
  const availableDestinations = from ? getAvailableCargoDestinations(from) : [];

  useEffect(() => {
    if (from && to) {
      const nextDate = getNextAvailableDate(from, to);
      setNextAvailableDate(nextDate);
      if (nextDate) {
        setDate(format(nextDate, 'yyyy-MM-dd'));
      }
    } else {
      setNextAvailableDate(null);
      setDate('');
    }
  }, [from, to]);

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFrom = e.target.value;
    setFrom(newFrom);
    setTo('');
    setError(null);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTo(e.target.value);
    setError(null);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (!isValidCargoDate(newDate, from, to)) {
      setError('Selected date is not available for this route');
      return;
    }
    setDate(newDate);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const routeError = validateCargoRoute(from, to);
    if (routeError) {
      setError(routeError);
      return;
    }

    if (!date) {
      setError('Please select a shipping date');
      return;
    }

    if (!isValidCargoDate(date, from, to)) {
      setError('Selected date is not available for this route');
      return;
    }

    onSearch({ from, to, date });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      {error && <ErrorMessage message={error} />}

      <div className="grid md:grid-cols-3 gap-4">
        <AirportSelect
          name="from"
          value={from}
          onChange={handleFromChange}
          label="From"
          availableAirports={availableOrigins}
        />

        <AirportSelect
          name="to"
          value={to}
          onChange={handleToChange}
          label="To"
          disabled={!from}
          availableAirports={availableDestinations}
        />

        <DateSelect
          label="Shipping Date"
          name="date"
          value={date}
          onChange={handleDateChange}
          minDate={nextAvailableDate ? format(nextAvailableDate, 'yyyy-MM-dd') : undefined}
          helperText={from && to ? getScheduleDescription(from, to) : ''}
        />
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-sky-600 text-white py-2 px-4 rounded-md hover:bg-sky-700 transition-colors"
      >
        Search Cargo Space
      </button>
    </form>
  );
}