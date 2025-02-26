import React from 'react';
import { Plane, Package } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';
import type { BookingSummary } from '../../types/user';

interface BookingHistoryProps {
  bookings: BookingSummary[];
}

export function BookingHistory({ bookings }: BookingHistoryProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Booking History</h2>
      
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {booking.type === 'flight' ? (
                  <Plane className="h-5 w-5 text-sky-600" />
                ) : (
                  <Package className="h-5 w-5 text-sky-600" />
                )}
                <span className="text-sm font-medium text-sky-600 capitalize">
                  {booking.type} Booking
                </span>
              </div>
              
              <h3 className="font-medium">{booking.reference}</h3>
              <p className="text-gray-600">
                {booking.from} → {booking.to}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(booking.date).toLocaleDateString()}
              </p>
            </div>

            <div className="text-right">
              <span className={`inline-block px-2 py-1 text-sm font-medium rounded-full capitalize
                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'}`}
              >
                {booking.status}
              </span>
              <p className="mt-2 font-medium">{formatCurrency(booking.amount)}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <button className="text-sky-600 hover:text-sky-700 text-sm">
              View Details
            </button>
            {booking.status === 'confirmed' && (
              <button className="text-sky-600 hover:text-sky-700 text-sm">
                Download Itinerary
              </button>
            )}
          </div>
        </div>
      ))}

      {bookings.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          No bookings found
        </div>
      )}
    </div>
  );
}