import type { 
  FlightSearchRequest, 
  BookingRequest,
  PaymentRequest 
} from '../types';

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

  if (params.passengers < 1) {
    return 'At least one passenger is required';
  }

  return null;
}

export function validateBooking(params: BookingRequest): string | null {
  if (!params.flightNumber || !params.date) {
    return 'Flight number and date are required';
  }

  if (!params.passengers?.length) {
    return 'At least one passenger is required';
  }

  if (!params.contact?.email || !params.contact?.phone) {
    return 'Contact email and phone are required';
  }

  return null;
}

export function validatePayment(params: PaymentRequest): string | null {
  if (!params.bookingReference) {
    return 'Booking reference is required';
  }

  if (!params.amount || params.amount <= 0) {
    return 'Invalid payment amount';
  }

  if (!params.method) {
    return 'Payment method is required';
  }

  return null;
}