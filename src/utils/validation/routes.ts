import { AirportCode } from '../../types/airport';

export function validateRoute(from: AirportCode, to: AirportCode): string | null {
  if (!from || !to) {
    return "Please select both origin and destination airports";
  }

  if (from === to) {
    return "Origin and destination cannot be the same";
  }

  // Ensure one end of the route is Dili (DIL)
  if (from !== 'DIL' && to !== 'DIL') {
    return "Either origin or destination must be Dili (DIL)";
  }

  return null;
}

export function getAvailableDestinations(from: AirportCode): AirportCode[] {
  // If origin is DIL, return all other airports
  if (from === 'DIL') {
    return ['DRW', 'DPS', 'SIN', 'OEC', 'XMN'];
  }

  // If origin is not DIL, only DIL is available as destination
  return ['DIL'];
}