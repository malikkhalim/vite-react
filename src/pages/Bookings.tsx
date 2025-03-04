import React from 'react';
import { Container } from '../components/layout/Container';
import { useUserStore } from '../stores/userStore';

export default function Bookings() {
  const { user } = useUserStore();

  // Mock data - replace with actual API calls
  const bookings = [
    {
      id: 'FL001',
      type: 'flight',
      from: 'DIL',
      to: 'DRW',
      date: '2024-03-20',
      status: 'confirmed',
      reference: 'ABC123',
    },
    {
      id: 'CG001',
      type: 'cargo',
      from: 'DIL',
      to: 'SIN',
      date: '2024-03-25',
      status: 'processing',
      reference: 'XYZ789',
    },
  ];

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 capitalize" 
                    style={{
                      backgroundColor: booking.type === 'flight' ? '#e0f2fe' : '#f0fdf4',
                      color: booking.type === 'flight' ? '#0369a1' : '#166534'
                    }}
                  >
                    {booking.type}
                  </span>
                  <h3 className="text-lg font-medium text-gray-900">
                    {booking.from} → {booking.to}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(booking.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 text-sm font-medium rounded-full capitalize"
                    style={{
                      backgroundColor: booking.status === 'confirmed' ? '#f0fdf4' : '#fef3c7',
                      color: booking.status === 'confirmed' ? '#166534' : '#92400e'
                    }}
                  >
                    {booking.status}
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Ref: {booking.reference}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button className="text-sky-600 hover:text-sky-700 text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}