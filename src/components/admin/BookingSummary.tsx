import React from 'react';
import { Plane, Package, DollarSign } from 'lucide-react';

interface BookingSummaryProps {
  type: 'flight' | 'cargo' | 'revenue';
}

export function BookingSummary({ type }: BookingSummaryProps) {
  // Mock data - replace with actual API calls
  const stats = {
    flight: {
      count: 156,
      trend: '+12%',
      label: 'Flight Bookings',
      icon: Plane,
    },
    cargo: {
      count: 89,
      trend: '+8%',
      label: 'Cargo Bookings',
      icon: Package,
    },
    revenue: {
      count: '$45,892',
      trend: '+15%',
      label: 'Total Revenue',
      icon: DollarSign,
    },
  };

  const { count, trend, label, icon: Icon } = stats[type];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <p className="text-2xl font-bold mt-1">{count}</p>
        </div>
        <div className="bg-sky-100 p-3 rounded-full">
          <Icon className="h-6 w-6 text-sky-600" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-green-600 text-sm font-medium">{trend}</span>
        <span className="text-gray-500 text-sm ml-2">vs last month</span>
      </div>
    </div>
  );
}