import type { FlightSearchRequest } from '../types/flight';

export function validateFlightSearch(params: FlightSearchRequest): string | null {
  if (!params.from || !params.to) {
    return 'Origin and destination are required';
  }

  if (params.from === params.to) {
    return 'Origin and destination must be different';
  }

  if (!params.date) {
    return 'Date is required';
  }

  if (!isValidDate(params.date)) {
    return 'Invalid date format';
  }

  return null;
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}