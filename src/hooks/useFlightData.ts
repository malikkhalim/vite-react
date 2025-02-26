import { useState, useEffect } from 'react';
import { AeroDiliAPI } from '../services/aerodili/api';
import type { Flight } from '../types/flight';

export function useFlightData(flightId: string) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [flightData, setFlightData] = useState<Flight | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchFlightData = async () => {
      try {
        const [pricingResponse, availabilityResponse] = await Promise.all([
          AeroDiliAPI.getFlightPricing(flightId),
          AeroDiliAPI.getFlightAvailability(flightId),
        ]);

        if (!mounted) return;

        if (!pricingResponse.success || !availabilityResponse.success) {
          throw new Error('Failed to fetch flight data');
        }

        const pricing = pricingResponse.data!;
        const availability = availabilityResponse.data!;

        setFlightData({
          ...flightData!,
          price: pricing.economyPrice,
          businessPrice: pricing.businessPrice,
          seatsAvailable: availability.economySeats,
          businessSeatsAvailable: availability.businessSeats,
        });
      } catch (err) {
        if (mounted) {
          setError('Unable to fetch real-time flight data');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (flightId) {
      fetchFlightData();
    }

    return () => {
      mounted = false;
    };
  }, [flightId]);

  return { loading, error, flightData };
}