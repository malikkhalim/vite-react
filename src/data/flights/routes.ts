import { AirportCode } from '../../types/airport';
import { Route } from '../../types/flight';

export const routes: Route[] = [
  {
    from: 'DIL',
    to: 'DRW',
    distance: 720,
    duration: 90,
    basePrice: 299,
    businessMultiplier: 2.5
  },
  {
    from: 'DIL',
    to: 'SIN',
    distance: 2100,
    duration: 240,
    basePrice: 499,
    businessMultiplier: 2.8
  },
  {
    from: 'DIL',
    to: 'DPS',
    distance: 1100,
    duration: 150,
    basePrice: 399,
    businessMultiplier: 2.5
  },
  {
    from: 'DIL',
    to: 'OEC',
    distance: 200,
    duration: 45,
    basePrice: 99,
    businessMultiplier: 2.0
  }
];