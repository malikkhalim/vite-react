import { HITPAY_CURRENCIES } from '../config/constants';
import type { CreatePaymentRequest } from '../types';

export function validatePaymentRequest(data: CreatePaymentRequest): string | null {
  if (!data.amount || data.amount <= 0) {
    return 'Invalid payment amount';
  }

  if (!Object.values(HITPAY_CURRENCIES).includes(data.currency)) {
    return 'Invalid currency';
  }

  if (!data.email || !isValidEmail(data.email)) {
    return 'Invalid email address';
  }

  if (!data.name) {
    return 'Name is required';
  }

  if (!data.reference_number) {
    return 'Reference number is required';
  }

  return null;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}