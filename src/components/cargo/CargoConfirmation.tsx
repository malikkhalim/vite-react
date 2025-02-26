import React from 'react';
import { Check, Package } from 'lucide-react';

interface CargoConfirmationProps {
  onClose: () => void;
}

export function CargoConfirmation({ onClose }: CargoConfirmationProps) {
  const bookingNumber = Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Cargo Booking Confirmed!</h2>
        <p className="text-gray-600 mt-2">Booking Reference: {bookingNumber}</p>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">
          You will receive a confirmation email with the booking details
        </p>
        <button
          onClick={onClose}
          className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}