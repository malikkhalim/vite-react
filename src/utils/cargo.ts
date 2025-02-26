import { PackageDetails, CargoFees } from '../types/cargo';

export const calculateVolume = (dimensions: { length: number; width: number; height: number }): number => {
  return (dimensions.length * dimensions.width * dimensions.height) / 1000000; // Convert to m³
};

export const calculateTotalWeight = (packages: PackageDetails[]): number => {
  return packages.reduce((total, pkg) => total + (pkg.weight * pkg.quantity), 0);
};

export const calculateTotalVolume = (packages: PackageDetails[]): number => {
  return packages.reduce((total, pkg) => total + (calculateVolume(pkg.dimensions) * pkg.quantity), 0);
};

export const calculateCargoFees = (totalWeight: number): CargoFees => {
  return {
    awbFee: 25, // Fixed AWB fee
    screeningFee: 0.15 * totalWeight, // $0.15 per kg
    handlingFee: 0.25 * totalWeight, // $0.25 per kg
    cargoCharge: 2.5 * totalWeight, // $2.50 per kg base rate
  };
};

export const calculatePickupFee = (weight: number): number => {
  if (weight <= 45) {
    return 80; // Base rate for up to 45kg
  }
  return 80 + (weight - 45) * 2; // $2/kg for additional weight
};

export const formatWeight = (weight: number): string => {
  return `${weight.toFixed(1)} kg`;
};

export const formatVolume = (volume: number): string => {
  return `${volume.toFixed(3)} m³`;
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};