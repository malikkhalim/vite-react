import { Flight } from '../types/flight';

export const availableFlights: Flight[] = [
  {
    id: 'FL001',
    from: 'DIL',
    to: 'DRW',
    departureDate: '2024-03-20T10:00:00',
    arrivalDate: '2024-03-20T11:30:00',
    price: 299,
    seatsAvailable: 45,
    businessPrice: 599,
    businessSeatsAvailable: 12,
    duration: 90,
    aircraft: 'Boeing 737-800',
    baggage: {
      economy: 23,
      business: 32
    },
    services: {
      economy: [
        'Complimentary snacks and beverages',
        'In-flight entertainment',
        'USB charging ports'
      ],
      business: [
        'Priority boarding',
        'Premium meals and beverages',
        'Extra legroom',
        'Lounge access',
        'Priority baggage handling'
      ]
    }
  },
  {
    id: 'FL002',
    from: 'DIL',
    to: 'OEC',
    departureDate: '2024-03-20T08:00:00',
    arrivalDate: '2024-03-20T08:45:00',
    price: 99,
    seatsAvailable: 20,
    businessPrice: 199,
    businessSeatsAvailable: 6,
    duration: 45,
    aircraft: 'ATR 72-600',
    baggage: {
      economy: 15,
      business: 25
    },
    services: {
      economy: [
        'Complimentary water',
        'Basic snacks'
      ],
      business: [
        'Priority boarding',
        'Premium snacks and beverages',
        'Extra legroom',
        'Priority baggage handling'
      ]
    }
  },
  {
    id: 'FL003',
    from: 'DIL',
    to: 'XMN',
    departureDate: '2024-03-20T23:00:00',
    arrivalDate: '2024-03-21T05:30:00',
    price: 599,
    seatsAvailable: 120,
    businessPrice: 1499,
    businessSeatsAvailable: 24,
    duration: 390,
    aircraft: 'Airbus A330-300',
    baggage: {
      economy: 30,
      business: 40
    },
    services: {
      economy: [
        'Full meal service',
        'In-flight entertainment',
        'USB charging ports',
        'Blanket and pillow'
      ],
      business: [
        'Priority check-in and boarding',
        'Gourmet meals with premium beverages',
        'Lie-flat seats',
        'Lounge access',
        'Priority baggage handling',
        'Amenity kit'
      ]
    }
  }
];