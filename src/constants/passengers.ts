import { PassengerTypeInfo } from '../types/flight';

export const PASSENGER_TYPES: Record<string, PassengerTypeInfo> = {
  adult: {
    type: 'adult',
    label: 'Adult',
    ageRange: '12+ years',
    description: 'Passengers aged 12 years and above',
    minPerBooking: 1
  },
  child: {
    type: 'child',
    label: 'Child',
    ageRange: '2-11 years',
    description: 'Passengers aged between 2-11 years'
  },
  infant: {
    type: 'infant',
    label: 'Infant',
    ageRange: '3 months - 2 years',
    description: 'Passengers aged between 3 months and 2 years',
    maxPerBooking: 1
  }
} as const;

export const MAX_PASSENGERS = 9;
export const MAX_INFANTS_PER_ADULT = 1;