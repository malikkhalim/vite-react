import { PaymentMethodInfo } from '../types/payment';
import { CreditCard, QrCode, Building } from 'lucide-react';

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'credit_card',
    label: 'Credit Card',
    description: 'Pay securely with credit or debit card',
    icon: CreditCard
  },
  {
    id: 'paynow',
    label: 'PayNow',
    description: 'Pay instantly with PayNow QR',
    icon: QrCode
  },
  {
    id: 'bank_transfer',
    label: 'Bank Transfer',
    description: 'Pay via bank transfer',
    icon: Building
  }
];

export const BANK_DETAILS = {
  bankName: 'Timor Pacific Bank',
  accountName: 'Timor Pacific Logistics Pte Ltd',
  accountNumber: '0123456789',
  swiftCode: 'TPACSGSG',
};