import React from 'react';
import { CreditCard, QrCode } from 'lucide-react';
import type { PaymentMethod } from '../../types/payment';

interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  disabled?: boolean;
}

export function PaymentMethodSelect({ value, onChange, disabled }: PaymentMethodSelectProps) {
  const methods = [
    {
      id: 'card',
      label: 'Credit Card',
      description: 'Pay securely with credit or debit card',
      icon: CreditCard
    },
    {
      id: 'paynow_online',
      label: 'PayNow',
      description: 'Pay instantly with PayNow QR',
      icon: QrCode
    }
  ] as const;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select Payment Method</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {methods.map(({ id, label, description, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id as PaymentMethod)}
            disabled={disabled}
            className={`p-4 border rounded-lg flex flex-col items-center gap-3 transition-colors ${
              value === id
                ? 'border-sky-600 bg-sky-50 text-sky-700'
                : 'border-gray-200 hover:border-gray-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Icon className="h-6 w-6" />
            <div className="text-center">
              <div className="font-medium">{label}</div>
              <div className="text-sm text-gray-500">{description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}