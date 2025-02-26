import React from 'react';
import { PassengerDetails } from './PassengerDetails';
import { PassengerData } from '../../../types/passenger';

interface PassengerListProps {
  passengers: PassengerData[];
  onChange: (index: number, field: string, value: string) => void;
}

export function PassengerList({ passengers, onChange }: PassengerListProps) {
  // Group passengers by type
  const groupedPassengers = passengers.reduce((groups, passenger, index) => {
    const type = passenger.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push({ ...passenger, index });
    return groups;
  }, {} as Record<string, (PassengerData & { index: number })[]>);

  return (
    <>
      {Object.entries(groupedPassengers).map(([type, typePassengers]) => (
        <div key={type} className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 capitalize">
            {type} Passengers
          </h3>
          {typePassengers.map(({ index, ...passenger }) => (
            <PassengerDetails
              key={index}
              index={index}
              type={passenger.type}
              values={passenger}
              onChange={onChange}
            />
          ))}
        </div>
      ))}
    </>
  );
}