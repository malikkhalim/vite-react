import React from 'react';

interface PassengerDetailsProps {
  passengers: Array<{
    name: string;
    type: string;
    seat?: string;
  }>;
}

export function PassengerDetails({ passengers }: PassengerDetailsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-red-600">Passenger Details</h2>
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Name</th>
            <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Type</th>
            <th className="text-left py-2 px-4 text-sm font-medium text-gray-600">Seat</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {passengers.map((passenger, index) => (
            <tr key={index}>
              <td className="py-2 px-4">{passenger.name}</td>
              <td className="py-2 px-4 capitalize">{passenger.type}</td>
              <td className="py-2 px-4">{passenger.seat || 'TBA'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}