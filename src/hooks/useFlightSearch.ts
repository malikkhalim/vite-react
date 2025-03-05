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
      console.log("Searching flights with form data:", formData);
      const searchResults = await FlightSearchAdapter.searchFlights(formData);
      
      console.log("Search results received:", 
        searchResults.outboundFlights.length, "outbound flights,", 
        searchResults.returnFlights.length, "return flights");
      
      setResults(searchResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Flight search failed';
      setError(errorMessage);
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