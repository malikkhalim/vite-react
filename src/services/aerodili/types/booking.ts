export interface BookingRequest {
  flightNumber: string;
  date: string;
  passengers: Array<{
    type: 'adult' | 'child' | 'infant';
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passport: {
      number: string;
      expiryDate: string;
      nationality: string;
    };
  }>;
  contact: {
    email: string;
    phone: string;
    address?: string;
  };
}

export interface BookingResponse {
  bookingReference: string;
  status: 'confirmed' | 'pending' | 'failed';
  totalAmount: number;
  currency: string;
  expiryTime: string;
}

export interface BookingStatusRequest {
  bookingReference: string;
}

export interface BookingStatusResponse {
  bookingReference: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'failed';
  paymentStatus: 'paid' | 'unpaid' | 'expired';
  expiryTime: string;
}