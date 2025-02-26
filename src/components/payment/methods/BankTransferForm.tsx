import React from 'react';

export function BankTransferForm() {
  const bankDetails = {
    bankName: 'Timor Pacific Bank',
    accountName: 'Timor Pacific Logistics Pte Ltd',
    accountNumber: '0123456789',
    swiftCode: 'TPACSGSG',
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="font-medium mb-2">Bank Transfer Details</h4>
        <p className="text-sm text-gray-600">
          Please transfer the exact amount to the following account
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(bankDetails).map(([key, value]) => (
          <div key={key}>
            <p className="text-sm text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </p>
            <p className="font-mono font-medium">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-800">
          Important: Please include your booking reference in the transfer
          description to ensure proper tracking of your payment.
        </p>
      </div>
    </div>
  );
}