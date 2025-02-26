import { useState } from 'react';
import { AeroDiliAPI } from '../services/aerodili/api';
import type { Flight, Passenger } from '../types/flight';
import type { AeroDiliBookingRequest } from '../services/aerodili/types';

interface UseBookingResult {
  loading: boolean;
  error: string | null;
  bookingReference: string | null;
  createBooking: (flight: Flight, passengers: Passenger[], flightClass: 'economy' | 'business') => Promise<void>;
}

export function useBooking(): UseBookingResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingReference, setBookingReference] = useState<string | null>(null);

  const createBooking = async (
    flight: Flight,
    passengers: Passenger[],
    flightClass: 'economy' | 'business'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const bookingData: AeroDiliBookingRequest = {
        flightNumber: flight.id,
        passengers: passengers.map(p => ({
          firstName: p.firstName,
          lastName: p.lastName,
          passport: p.passport,
          seatClass: flightClass,
        })),
        contactEmail: passengers[0].email,
        contactPhone: passengers[0].phone,
      };

      const response = await AeroDiliAPI.createBooking(bookingData);

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Booking failed');
      }

      setBookingReference(response.data.bookingReference);
      window.location.href = response.data.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, bookingReference, createBooking };
}