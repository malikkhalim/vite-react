import React from 'react';

interface Flight {
  flightNo: string;
  departure: {
    airport: string;
    code: string;
    terminal?: string;
    date: string;
    time: string;
  };
  arrival: {
    airport: string;
    code: string;
    terminal?: string;
    date: string;
    time: string;
  };
  class: string;
  nvb: string;
  nva: string;
  status: string;
  baggage: string;
}

interface ItineraryTableProps {
  flights: Flight[];
}

export function ItineraryTable({ flights }: ItineraryTableProps) {
  return (
    <div className="mb-6">
      <div className="bg-red-600 text-white px-4 py-2 font-bold mb-4">
        Itinerary Details
      </div>
      
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">FLIGHT NO.</th>
            <th className="text-left py-2">DEPARTURE</th>
            <th className="text-left py-2">ARRIVAL</th>
            <th className="text-left py-2">CLASS</th>
            <th className="text-left py-2">NVB</th>
            <th className="text-left py-2">NVA</th>
            <th className="text-left py-2">STATUS</th>
            <th className="text-left py-2">BAG</th>
          </tr>
        </thead>
        <tbody>
          {flights.map((flight, index) => (
            <tr key={index} className="border-b">
              <td className="py-3">{flight.flightNo}</td>
              <td className="py-3">
                <div>{flight.departure.airport} ({flight.departure.code})</div>
                <div>{flight.departure.date} / {flight.departure.time}</div>
                {flight.departure.terminal && (
                  <div>{flight.departure.terminal}</div>
                )}
              </td>
              <td className="py-3">
                <div>{flight.arrival.airport} ({flight.arrival.code})</div>
                <div>{flight.arrival.date} / {flight.arrival.time}</div>
                {flight.arrival.terminal && (
                  <div>{flight.arrival.terminal}</div>
                )}
              </td>
              <td className="py-3">{flight.class}</td>
              <td className="py-3">{flight.nvb}</td>
              <td className="py-3">{flight.nva}</td>
              <td className="py-3">{flight.status}</td>
              <td className="py-3">{flight.baggage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}