export type PaymentMethod = 'card' | 'paynow_online' | 'wechat'; 

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  currency: string;
  reference: string;
}

export interface PaymentMethodInfo {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: string;
}

export interface PaymentFormData {
  passengers: any[];
  contactDetails: {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
  totalAmount: number;
}