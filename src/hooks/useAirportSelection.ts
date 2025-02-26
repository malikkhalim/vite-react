import { useState, useMemo } from 'react';
import { ROUTES } from '../constants/routes';
import { AirportCode } from '../constants/airports';

export function useAirportSelection() {
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const availableDestinations = useMemo(() => {
    if (!from) return [];
    return ROUTES[from as AirportCode] || [];
  }, [from]);

  const handleFromChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFrom = e.target.value;
    setFrom(newFrom);
    setTo(''); // Reset destination when origin changes
  };

  const handleToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTo(e.target.value);
  };

  return {
    from,
    to,
    availableDestinations,
    handleFromChange,
    handleToChange
  };
}