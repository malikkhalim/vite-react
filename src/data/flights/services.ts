import { FlightServices } from '../../types/flight';

export const services: Record<string, FlightServices> = {
  international: {
    economy: [
      'Complimentary meals and beverages',
      'In-flight entertainment',
      'USB charging ports',
      'Free baggage allowance'
    ],
    business: [
      'Priority check-in and boarding',
      'Lounge access',
      'Premium meals and beverages',
      'Extra legroom seats',
      'Enhanced baggage allowance',
      'Personal entertainment system',
      'Amenity kit'
    ]
  },
  domestic: {
    economy: [
      'Complimentary water',
      'Light snacks',
      'Free baggage allowance'
    ],
    business: [
      'Priority check-in',
      'Premium snacks and beverages',
      'Extra legroom seats',
      'Enhanced baggage allowance'
    ]
  }
};