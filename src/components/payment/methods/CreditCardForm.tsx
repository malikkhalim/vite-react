import React from 'react';
import { CreditCard, Calendar, Lock } from 'lucide-react';
import { FormInput } from '../../auth/FormInput';

export function CreditCardForm() {
  return (
    <div className="space-y-6">
      <div>
        <FormInput
          label="Card Number"
          type="text"
          placeholder="1234 5678 9012 3456"
          required
          className="pl-10"
          icon={CreditCard}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Expiry Date"
          type="text"
          placeholder="MM/YY"
          required
          className="pl-10"
          icon={Calendar}
        />

        <FormInput
          label="CVV"
          type="password"
          placeholder="123"
          required
          maxLength={4}
          className="pl-10"
          icon={Lock}
        />
      </div>

      <FormInput
        label="Cardholder Name"
        type="text"
        placeholder="Name as shown on card"
        required
      />
    </div>
  );
}