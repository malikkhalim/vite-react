import React from 'react';

interface PassengerTableProps {
  passengers: Array<{
    no: number;
    name: string;
    ticketNumber: string;
    ssr?: string;
  }>;
}

export function PassengerTable({ passengers }: PassengerTableProps) {
  return (
    <div className="mb-6">
      <div className="bg-red-600 text-white px-4 py-2 font-bold mb-4">
        Passenger Details
      </div>
      
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">NO</th>
            <th className="text-left py-2">NAME</th>
            <th className="text-left py-2">TICKET NUMBER</th>
            <th className="text-left py-2">SSR</th>
          </tr>
        </thead>
        <tbody>
          {passengers.map((passenger) => (
            <tr key={passenger.no} className="border-b">
              <td className="py-3">{passenger.no}</td>
              <td className="py-3">{passenger.name}</td>
              <td className="py-3">{passenger.ticketNumber}</td>
              <td className="py-3">{passenger.ssr || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}