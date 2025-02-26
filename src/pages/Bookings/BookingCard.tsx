import React from 'react';
import { Plane, Package } from 'lucide-react';
import { formatCurrency } from '../../utils/formatting';

interface BookingCardProps {
  booking: {
    id: string;
    type: 'flight' | 'cargo';
    reference: string;
    from: string;
    to: string;
    date: string;
    status: string;
    amount: number;
  };
}

export function BookingCard({ booking }: BookingCardProps) {
  const Icon = booking.type === 'flight' ? Plane : Package;
  const statusColors = {
    confirmed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-5 w-5 text-sky-600" />
            <span className="text-sm font-medium text-sky-600 capitalize">
              {booking.type} Booking
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-1">
            {booking.from} → {booking.to}
          </h3>
          <p className="text-gray-600">
            {new Date(booking.date).toLocaleDateString()}
          </p>
        </div>

        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${
            statusColors[booking.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'
          }`}>
            {booking.status}
          </span>
          <p className="mt-2 font-medium">{formatCurrency(booking.amount)}</p>
          <p className="text-sm text-gray-500">Ref: {booking.reference}</p>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button className="text-sky-600 hover:text-sky-700 text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );
}