import { Aircraft } from '../../types/flight';

export const aircraft: Aircraft[] = [
  {
    type: 'Boeing 737-800',
    code: '738',
    capacity: {
      economy: 162,
      business: 12
    },
    baggage: {
      economy: 23,
      business: 32
    }
  },
  {
    type: 'Airbus A320',
    code: '320',
    capacity: {
      economy: 150,
      business: 12
    },
    baggage: {
      economy: 23,
      business: 32
    }
  },
  {
    type: 'ATR 72-600',
    code: 'AT7',
    capacity: {
      economy: 68,
      business: 0
    },
    baggage: {
      economy: 15,
      business: 0
    }
  }
];