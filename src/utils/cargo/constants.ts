export const PICKUP_SERVICE = {
  BASE_WEIGHT: 45,
  BASE_PRICE: 80,
  ADDITIONAL_PRICE_PER_KG: 2,
} as const;

export const CARGO_FEES = {
  AWB_FEE: 25,
  SCREENING_FEE_PER_KG: 0.15,
  HANDLING_FEE_PER_KG: 0.25,
  CARGO_CHARGE_PER_KG: 2.5,
} as const;

export const PACKAGE_TYPES = [
  { value: 'box', label: 'Box' },
  { value: 'pallet', label: 'Pallet' },
  { value: 'container', label: 'Container' },
  { value: 'crate', label: 'Crate' },
  { value: 'drum', label: 'Drum' },
  { value: 'bag', label: 'Bag' }
] as const;

export const CARGO_TYPES = [
  { 
    id: 'general', 
    label: 'General Cargo',
    description: 'Standard cargo items'
  },
  { 
    id: 'pharma', 
    label: 'Pharmaceutical',
    description: 'Temperature-controlled pharmaceuticals'
  },
  { 
    id: 'perishable', 
    label: 'Perishable',
    description: 'Food and other perishable items'
  },
  { 
    id: 'dangerous', 
    label: 'Dangerous Goods',
    description: 'Hazardous materials'
  },
  { 
    id: 'special', 
    label: 'Special Cargo',
    description: 'Valuable or sensitive items'
  }
] as const;