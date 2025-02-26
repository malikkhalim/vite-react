import { useState, useCallback } from 'react';
import { FlightSearchAdapter } from '../services/aerodili/adapters/flight-search';
import type { Flight, BookingFormData } from '../types/flight';

interface SearchResults {
  outboundFlights: Flight[];
  returnFlights: Flight[];
}

export function useFlightSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResults | null>(null);

  const searchFlights = useCallback(async (formData: BookingFormData) => {
    setLoading(true);
    setError(null);

    try {
      const searchResults = await FlightSearchAdapter.searchFlights(formData);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Flight search failed');
      console.error('Flight search error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    outboundFlights: results?.outboundFlights || [],
    returnFlights: results?.returnFlights || [],
    searchFlights,
    clearError: () => setError(null)
  };
}