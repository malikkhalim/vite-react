export interface AeroDiliResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface AeroDiliPricing {
  flightNumber: string;
  economyPrice: number;
  businessPrice: number;
  taxes: {
    amount: number;
    description: string;
  }[];
  currency: string;
}

export interface AeroDiliAvailability {
  flightNumber: string;
  economySeats: number;
  businessSeats: number;
  lastUpdated: string;
}

export interface AeroDiliBookingRequest {
  flightNumber: string;
  passengers: {
    firstName: string;
    lastName: string;
    passport: string;
    seatClass: 'economy' | 'business';
  }[];
  contactEmail: string;
  contactPhone: string;
}

export interface AeroDiliBookingResponse {
  bookingReference: string;
  ticketNumbers: string[];
  totalAmount: number;
  currency: string;
  paymentUrl: string;
}