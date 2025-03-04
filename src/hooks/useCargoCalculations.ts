import { useState, useEffect } from 'react';
import { useAdminStore } from '../stores/adminStore';
import { CargoType, PackageDetails, CargoFees } from '../types/cargo';

export function useCargoCalculations() {
  const { settings, loadSettings, isLoading, error } = useAdminStore();
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    const initSettings = async () => {
      if (!settings && !isLoading) {
        setLocalLoading(true);
        await loadSettings();
        setLocalLoading(false);
      }
    };
    
    initSettings();
  }, [settings, isLoading, loadSettings]);

  const calculateVolume = (dimensions: { length: number; width: number; height: number }): number => {
    const { length, width, height } = dimensions;
    if (!length || !width || !height) return 0;
    return (length * width * height) / 1000000; // Convert to m³
  };

  const calculateTotalWeight = (packages: PackageDetails[]): number => {
    return packages.reduce((total, pkg) => {
      if (!pkg.weight || !pkg.quantity) return total;
      return total + (pkg.weight * pkg.quantity);
    }, 0);
  };

  const calculateTotalVolume = (packages: PackageDetails[]): number => {
    return packages.reduce((total, pkg) => {
      if (!pkg.dimensions || !pkg.quantity) return total;
      return total + (calculateVolume(pkg.dimensions) * pkg.quantity);
    }, 0);
  };

  const calculateCargoFees = (totalWeight: number): CargoFees => {
    if (!settings || !totalWeight || totalWeight <= 0) {
      return {
        awbFee: 25, // Default AWB fee if settings not loaded
        screeningFee: 0,
        handlingFee: 0,
        cargoCharge: 0
      };
    }

    const { cargoFees } = settings;
    
    return {
      awbFee: cargoFees.awbFee,
      screeningFee: cargoFees.screeningFeePerKg * totalWeight,
      handlingFee: cargoFees.handlingFeePerKg * totalWeight,
      cargoCharge: cargoFees.cargoChargePerKg * totalWeight,
    };
  };

  const calculatePickupFee = (weight: number): number => {
    if (!settings || !weight || weight <= 0) return 0;
    
    const { pickupService } = settings;
    
    if (weight <= pickupService.baseWeight) {
      return pickupService.basePrice;
    }
    
    return pickupService.basePrice + 
      (weight - pickupService.baseWeight) * pickupService.additionalPricePerKg;
  };

  // Get route-based pricing
  const getRoutePricing = (from: string, to: string, cargoType: CargoType): number => {
    if (!settings || !settings.cargoRoutePrices) return 0;
    
    const route = settings.cargoRoutePrices.find(r => 
      r.from === from && r.to === to
    );
    
    if (!route) return 0;
    return route.prices[cargoType] || 0;
  };

  return {
    calculateVolume,
    calculateTotalWeight,
    calculateTotalVolume,
    calculateCargoFees,
    calculatePickupFee,
    getRoutePricing,
    settings,
    isLoading: isLoading || localLoading,
    error
  };
}