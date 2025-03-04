export interface CargoRoutePrice {
  from: string;
  to: string;
  prices: {
    general: number;
    pharma: number;
    perishable: number;
    dangerous: number;
    special: number;
  };
  currency?: 'SGD' | 'USD';
}

export interface AdminSettings {
  cargoFees: {
    awbFee: number;
    screeningFeePerKg: number;
    handlingFeePerKg: number;
    cargoChargePerKg: number;
  };
  pickupService: {
    baseWeight: number;
    basePrice: number;
    additionalPricePerKg: number;
  };
  cargoRoutePrices: CargoRoutePrice[];
}

export interface AdminState {
  settings: AdminSettings | null;
  isLoading: boolean;
  error: string | null;
}
