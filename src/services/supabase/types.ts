export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  booking_type: 'flight' | 'cargo';
  reference_number: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  created_at: string;
  updated_at: string;
}

export interface FlightBooking extends Booking {
  flight_number: string;
  from_airport: string;
  to_airport: string;
  departure_date: string;
  arrival_date: string;
  class: string;
  passengers: Array<{
    first_name: string;
    last_name: string;
    passport: string;
  }>;
  baggage_allowance: number;
}

export interface CargoBooking extends Booking {
  from_airport: string;
  to_airport: string;
  shipping_date: string;
  cargo_type: 'general' | 'pharma' | 'perishable' | 'dangerous' | 'special';
  total_weight: number;
  total_volume: number;
  special_instructions?: string;
  dangerous_goods: boolean;
  needs_pickup: boolean;
}

export interface CargoPackage {
  id: string;
  cargo_booking_id: string;
  package_type: string;
  quantity: number;
  weight: number;
  length: number;
  width: number;
  height: number;
  description: string;
}

export interface CargoContact {
  id: string;
  cargo_booking_id: string;
  contact_type: 'shipper' | 'consignee';
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  tin?: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}