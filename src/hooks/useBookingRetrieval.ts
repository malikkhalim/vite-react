import { useState } from 'react';
import { RetrievePNRAdapter } from '../services/aerodili/adapters/retrieve-pnr';
import type { BookingDetails } from '../services/aerodili/types/retrieve-pnr';

export function useBookingRetrieval() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  const retrieveBooking = async (bookingCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const details = await RetrievePNRAdapter.retrieveBooking(bookingCode);
      setBookingDetails(details);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve booking');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    bookingDetails,
    retrieveBooking,
    clearError: () => setError(null)
  };
}