// Switch between mock and real service based on environment
import { lookupMockAddress, MockAddress } from './mock';
import { lookupPostalCode, OneMapAddress } from './onemap';

export type AddressResult = MockAddress | OneMapAddress;

export async function lookupAddress(postalCode: string): Promise<AddressResult | null> {
  // Use mock service for development
  if (process.env.NODE_ENV === 'development') {
    return lookupMockAddress(postalCode);
  }
  
  // Use real service for production
  return lookupPostalCode(postalCode);
}