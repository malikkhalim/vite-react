export interface Profile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  created_at: string;
  updated_at: string;
}

export interface BookingSummary {
  id: string;
  type: 'flight' | 'cargo';
  reference: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  from: string;
  to: string;
  date: string;
  amount: number;
}