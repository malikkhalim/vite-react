import { PackageDetails } from '../../types/cargo';

export const validateWeight = (weight: number): boolean => {
  return Number.isInteger(weight);
};

export const validateDimensions = (dimensions: { length: number; width: number; height: number }): boolean => {
  return Object.values(dimensions).every(value => Number.isInteger(value) && value > 0);
};

export const validatePackage = (pkg: PackageDetails): string[] => {
  const errors: string[] = [];

  if (!validateWeight(pkg.weight)) {
    errors.push('Weight must be a whole number');
  }

  if (!validateDimensions(pkg.dimensions)) {
    errors.push('Dimensions must be positive whole numbers');
  }

  if (pkg.quantity < 1) {
    errors.push('Quantity must be at least 1');
  }

  if (!pkg.description.trim()) {
    errors.push('Description is required');
  }

  return errors;
};

export const validatePostalCode = (postalCode: string): boolean => {
  return /^\d{6}$/.test(postalCode);
};