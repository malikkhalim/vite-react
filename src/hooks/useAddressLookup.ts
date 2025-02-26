import { useState } from 'react';
import { lookupAddress } from '../services/address';
import type { AddressResult } from '../services/address';

interface AddressLookupResult {
  address: string | null;
  loading: boolean;
  error: string | null;
  lookupAddress: (postalCode: string) => Promise<void>;
}

export function useAddressLookup(): AddressLookupResult {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (postalCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await lookupAddress(postalCode);
      
      if (!result) {
        throw new Error('No address found for this postal code. Try: 068877, 018956, 049315, 238859, or 179103');
      }

      setAddress(result.ADDRESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to lookup address');
      setAddress(null);
    } finally {
      setLoading(false);
    }
  };

  return { 
    address, 
    loading, 
    error, 
    lookupAddress: handleLookup 
  };
}