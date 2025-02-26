import { CARGO_FEES, PICKUP_SERVICE } from './constants';
import type { PackageDetails, CargoFees } from '../../types/cargo';

export const calculateVolume = (dimensions: { length: number; width: number; height: number }): number => {
  const { length, width, height } = dimensions;
  if (!length || !width || !height) return 0;
  return (length * width * height) / 1000000; // Convert to m³
};

export const calculateTotalWeight = (packages: PackageDetails[]): number => {
  return packages.reduce((total, pkg) => {
    if (!pkg.weight || !pkg.quantity) return total;
    return total + (pkg.weight * pkg.quantity);
  }, 0);
};

export const calculateTotalVolume = (packages: PackageDetails[]): number => {
  return packages.reduce((total, pkg) => {
    if (!pkg.dimensions || !pkg.quantity) return total;
    return total + (calculateVolume(pkg.dimensions) * pkg.quantity);
  }, 0);
};

export const calculateCargoFees = (totalWeight: number): CargoFees => {
  if (!totalWeight || totalWeight <= 0) {
    return {
      awbFee: CARGO_FEES.AWB_FEE,
      screeningFee: 0,
      handlingFee: 0,
      cargoCharge: 0
    };
  }

  return {
    awbFee: CARGO_FEES.AWB_FEE,
    screeningFee: CARGO_FEES.SCREENING_FEE_PER_KG * totalWeight,
    handlingFee: CARGO_FEES.HANDLING_FEE_PER_KG * totalWeight,
    cargoCharge: CARGO_FEES.CARGO_CHARGE_PER_KG * totalWeight,
  };
};

export const calculatePickupFee = (weight: number): number => {
  if (!weight || weight <= 0) return 0;
  
  if (weight <= PICKUP_SERVICE.BASE_WEIGHT) {
    return PICKUP_SERVICE.BASE_PRICE;
  }
  
  return PICKUP_SERVICE.BASE_PRICE + 
    (weight - PICKUP_SERVICE.BASE_WEIGHT) * PICKUP_SERVICE.ADDITIONAL_PRICE_PER_KG;
};