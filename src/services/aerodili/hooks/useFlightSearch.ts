import { useState, useCallback } from 'react';
import { FlightAdapter } from '../adapters/flight';
import type { FlightSearchRequest, FlightSearchResponse } from '../types/flight';

export function useFlightSearch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<FlightSearchResponse | null>(null);

  const searchFlights = useCallback(async (params: FlightSearchRequest) => {
    setLoading(true);
    setError(null);

    try {
      const response = await FlightAdapter.searchFlights(params);
      
      if (!response.success) {
        throw new Error(response.error?.message || 'Search failed');
      }

      setResults(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    results,
    searchFlights
  };
}