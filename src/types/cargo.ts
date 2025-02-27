export type CargoType = 'general' | 'pharma' | 'perishable' | 'dangerous' | 'special';
export type PackageType = 'box' | 'pallet' | 'container' | 'crate' | 'drum' | 'bag';
export type PaymentMethod = 'credit_card' | 'company_account';

export interface CargoSearchData {
  from: string;
  to: string;
  date: string;
}

export interface PackageDetails {
  type: PackageType;
  quantity: number;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  description: string;
}

export interface CargoDetails extends CargoSearchData {
  cargoType: CargoType;
  packages: PackageDetails[];
  specialInstructions?: string;
  dangerous: boolean;
  totalWeight: number;
  totalVolume: number;
}

export interface ContactDetails {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  tin?: string;
}

export interface CargoFees {
  awbFee: number;
  screeningFee: number;
  handlingFee: number;
  cargoCharge: number;
}

export interface PickupDetails {
  address: string;
  contact: {
    name: string;
    phone: string;
  };
  fee: number;
}

export interface CargoSummary {
  cargoDetails: CargoDetails;
  contactDetails: {
    shipper: ContactDetails;
    consignee: ContactDetails;
  };
  fees: CargoFees;
  pickup?: PickupDetails;
  totalAmount: number;
}

export interface PaymentDetails {
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
}