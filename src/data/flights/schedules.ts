import { FlightSchedule } from '../../types/flight';

export const schedules: FlightSchedule[] = [
  // Dili (DIL) to Darwin (DRW)
  {
    routeId: 'DIL-DRW',
    flightNumber: 'TP101',
    departureTime: '07:00',
    frequency: ['mon', 'wed', 'fri', 'sun']
  },
  {
    routeId: 'DIL-DRW',
    flightNumber: 'TP103',
    departureTime: '14:30',
    frequency: ['tue', 'thu', 'sat']
  },

  // Dili (DIL) to Singapore (SIN)
  {
    routeId: 'DIL-SIN',
    flightNumber: 'TP201',
    departureTime: '08:30',
    frequency: ['mon', 'thu', 'sat']
  },
  {
    routeId: 'DIL-SIN',
    flightNumber: 'TP203',
    departureTime: '19:45',
    frequency: ['wed', 'sun']
  },

  // Dili (DIL) to Bali/Denpasar (DPS)
  {
    routeId: 'DIL-DPS',
    flightNumber: 'TP301',
    departureTime: '09:15',
    frequency: ['tue', 'fri', 'sun']
  },
  {
    routeId: 'DIL-DPS',
    flightNumber: 'TP303',
    departureTime: '16:30',
    frequency: ['mon', 'thu', 'sat']
  },

  // Dili (DIL) to Oecusse (OEC)
  {
    routeId: 'DIL-OEC',
    flightNumber: 'TP401',
    departureTime: '08:00',
    frequency: ['mon', 'tue', 'wed', 'thu', 'fri']
  },
  {
    routeId: 'DIL-OEC',
    flightNumber: 'TP403',
    departureTime: '15:30',
    frequency: ['sat', 'sun']
  }
];