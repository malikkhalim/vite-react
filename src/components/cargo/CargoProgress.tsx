import React from 'react';
import { Package } from 'lucide-react';

interface CargoProgressProps {
  currentStep: number;
}

export function CargoProgress({ currentStep }: CargoProgressProps) {
  const steps = [
    { number: 1, label: 'Route & Date' },
    { number: 2, label: 'Cargo Details' },
    { number: 3, label: 'Contact Details' },
    { number: 4, label: 'Summary & Add-ons' },
    { number: 5, label: 'Checkout' },
    { number: 6, label: 'Confirmation' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`flex items-center ${
              index !== steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step.number
                  ? 'bg-sky-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step.number}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  currentStep > step.number ? 'bg-sky-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between max-w-4xl mx-auto mt-2 text-sm text-gray-600">
        {steps.map((step) => (
          <span key={step.number}>{step.label}</span>
        ))}
      </div>
    </div>
  );
}