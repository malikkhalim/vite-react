import React from 'react';
import { QrCode } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatting';

interface PayNowFormProps {
  amount: number;
}

export function PayNowForm({ amount }: PayNowFormProps) {
  // In a real app, this would be generated from the backend
  const mockQrCode = 'https://placehold.co/300x300/e0f2fe/0369a1?text=PayNow+QR';
  const mockUen = '201234567K';
  const mockReference = `TP${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="font-medium mb-2">Scan QR Code to Pay</h4>
        <p className="text-sm text-gray-600">
          Use your banking app to scan the PayNow QR code
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-sky-50 p-4 rounded-lg">
          <img 
            src={mockQrCode} 
            alt="PayNow QR Code" 
            className="w-64 h-64"
          />
        </div>
      </div>

      <div className="space-y-4 text-center">
        <div>
          <p className="text-sm text-gray-600">UEN</p>
          <p className="font-mono font-medium">{mockUen}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Reference Number</p>
          <p className="font-mono font-medium">{mockReference}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Amount to Pay</p>
          <p className="font-medium text-lg">{formatCurrency(amount)}</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          Important: Please include the reference number in your payment description
          to ensure proper tracking of your payment.
        </p>
      </div>
    </div>
  );
}