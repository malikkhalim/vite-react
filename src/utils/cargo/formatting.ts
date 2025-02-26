import { PackageDetails } from '../../types/cargo';

export const formatWeight = (weight: number | undefined): string => {
  if (typeof weight !== 'number' || isNaN(weight)) return '0 kg';
  return `${Math.round(weight)} kg`;
};

export const formatVolume = (volume: number | undefined): string => {
  if (typeof volume !== 'number' || isNaN(volume)) return '0.000 m³';
  return `${volume.toFixed(3)} m³`;
};

export const formatCurrency = (amount: number | undefined): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
  return `$${amount.toFixed(2)}`;
};

export const formatTotalWeight = (packages: PackageDetails[]): number => {
  return packages.reduce((total, pkg) => {
    const weight = pkg.weight || 0;
    const quantity = pkg.quantity || 0;
    return total + (weight * quantity);
  }, 0);
};