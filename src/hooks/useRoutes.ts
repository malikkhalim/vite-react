import { useState, useEffect } from 'react';
import { RouteOperationsAdapter } from '../services/aerodili/adapters/route-operation';
import type { AirportCode } from '../types/airport';

export function useRoutes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [airports, setAirports] = useState<{
    code: AirportCode;
    city: string;
    name: string;
    country: string;
  }[]>([]);
  const [routes, setRoutes] = useState<{
    from: AirportCode;
    to: AirportCode;
  }[]>([]);

  // Function to get destinations for a specific origin
  const getDestinationsFor = (origin: AirportCode): AirportCode[] => {
    return routes
      .filter(route => route.from === origin)
      .map(route => route.to);
  };

  useEffect(() => {
    const fetchRouteData = async () => {
      try {
        setLoading(true);
        
        // Get all routes
        const routeData = await RouteOperationsAdapter.getRoutes();
        setRoutes(routeData.map((r: { from: any; to: any; }) => ({ from: r.from, to: r.to })));
        
        // Get all airports
        const airportData = await RouteOperationsAdapter.getAirports();
        setAirports(airportData);
        
        setError(null);
      } catch (err) {
        setError('Failed to load flight routes. Please try again later.');
        console.error('Error loading routes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, []);

  return {
    loading,
    error,
    airports,
    getDestinationsFor
  };
}