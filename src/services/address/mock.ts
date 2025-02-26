import { delay } from '../../utils/async';

export interface MockAddress {
  ADDRESS: string;
  POSTAL: string;
  BUILDING: string;
  BLOCK: string;
}

// Mock address database
const mockAddresses: Record<string, MockAddress> = {
  '068877': {
    POSTAL: '068877',
    BUILDING: 'Singapore Land Tower',
    BLOCK: '50',
    ADDRESS: '50 Raffles Place, Singapore Land Tower'
  },
  '018956': {
    POSTAL: '018956',
    BUILDING: 'Marina Bay Financial Centre',
    BLOCK: '12',
    ADDRESS: '12 Marina Boulevard, Marina Bay Financial Centre'
  },
  '049315': {
    POSTAL: '049315',
    BUILDING: 'The Gateway',
    BLOCK: '150',
    ADDRESS: '150 Beach Road, The Gateway'
  },
  '238859': {
    POSTAL: '238859',
    BUILDING: 'Forum The Shopping Mall',
    BLOCK: '583',
    ADDRESS: '583 Orchard Road, Forum The Shopping Mall'
  },
  '179103': {
    POSTAL: '179103',
    BUILDING: 'Tekka Centre',
    BLOCK: '665',
    ADDRESS: '665 Buffalo Road, Tekka Centre'
  }
};

export async function lookupMockAddress(postalCode: string): Promise<MockAddress | null> {
  // Simulate network delay
  await delay(800);
  
  return mockAddresses[postalCode] || null;
}