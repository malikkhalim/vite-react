import React, { useState } from 'react';
import { Users, MinusCircle, PlusCircle, ChevronDown } from 'lucide-react';
import { PassengerCount, PassengerType } from '../../types/flight';
import { PASSENGER_TYPES, MAX_PASSENGERS, MAX_INFANTS_PER_ADULT } from '../../constants/passengers';

interface PassengerTypeSelectProps {
  value: PassengerCount;
  onChange: (value: PassengerCount) => void;
}

export function PassengerTypeSelect({ value, onChange }: PassengerTypeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const totalPassengers = value.adult + value.child + value.infant;

  const handleChange = (type: PassengerType, increment: boolean) => {
    const newValue = { ...value };
    const change = increment ? 1 : -1;

    // Validation checks
    if (increment && totalPassengers >= MAX_PASSENGERS) return;
    if (!increment && newValue[type] <= 0) return;
    if (type === 'infant' && increment && newValue.infant >= newValue.adult) return;
    if (type === 'adult' && !increment && newValue.adult <= newValue.infant) return;
    if (type === 'adult' && newValue.adult <= 1 && !increment) return;

    newValue[type] += change;
    onChange(newValue);
  };

  const getSummaryText = () => {
    const parts = [];
    if (value.adult) parts.push(`${value.adult} Adult${value.adult !== 1 ? 's' : ''}`);
    if (value.child) parts.push(`${value.child} Child${value.child !== 1 ? 'ren' : ''}`);
    if (value.infant) parts.push(`${value.infant} Infant${value.infant !== 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Passengers
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
      >
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-400" />
          <span className="text-gray-900">{getSummaryText()}</span>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {Object.values(PASSENGER_TYPES).map(({ type, label, ageRange, description }) => (
            <div 
              key={type} 
              className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{label}</span>
                    <span className="text-sm text-gray-500">({ageRange})</span>
                  </div>
                  <div className="text-sm text-gray-500">{description}</div>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChange(type, false);
                    }}
                    disabled={
                      value[type] <= 0 ||
                      (type === 'adult' && value.adult <= 1) ||
                      (type === 'adult' && value.adult <= value.infant)
                    }
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1"
                  >
                    <MinusCircle className="h-5 w-5" />
                  </button>
                  
                  <span className="w-8 text-center font-medium text-gray-900">
                    {value[type]}
                  </span>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChange(type, true);
                    }}
                    disabled={
                      totalPassengers >= MAX_PASSENGERS ||
                      (type === 'infant' && value.infant >= value.adult)
                    }
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 p-1"
                  >
                    <PlusCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {type === 'infant' && value.infant > 0 && value.infant === value.adult && (
                <div className="mt-2 text-xs text-amber-600">
                  Maximum 1 infant per adult passenger
                </div>
              )}
            </div>
          ))}

          <div className="p-3 bg-gray-50 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total passengers</span>
              <span className="font-medium text-gray-900">{totalPassengers}</span>
            </div>
            {totalPassengers === MAX_PASSENGERS && (
              <div className="mt-1 text-xs text-amber-600">
                Maximum {MAX_PASSENGERS} passengers per booking
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}