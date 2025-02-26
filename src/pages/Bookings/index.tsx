import React from 'react';
import { Container } from '../../components/layout/Container';
import { BookingCard } from './BookingCard';

// Mock data - replace with actual API calls
const mockBookings = [
  {
    id: '1',
    type: 'flight',
    reference: 'FL123456',
    from: 'DIL',
    to: 'DRW',
    date: '2024-03-20',
    status: 'confirmed',
    amount: 299
  },
  {
    id: '2',
    type: 'cargo',
    reference: 'CG789012',
    from: 'SIN',
    to: 'DIL',
    date: '2024-03-25',
    status: 'pending',
    amount: 450
  }
];

export default function Bookings() {
  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
        
        <div className="space-y-6">
          {mockBookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}

          {mockBookings.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">You don't have any bookings yet.</p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}