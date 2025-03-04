import { useEffect } from 'react';
import { useAdminStore } from '../stores/adminStore';
import { CargoType, PackageDetails, CargoFees } from '../types/cargo';

export function useCargoFees() {
  const { settings, loadSettings, isLoading } = useAdminStore();

  // Load settings if they aren't already loaded
  useEffect(() => {
    if (!settings && !isLoading) {
      loadSettings();
    }
  }, [settings, isLoading, loadSettings]);

  const calculateCargoFees = (totalWeight: number): CargoFees => {
    if (!settings || !totalWeight || totalWeight <= 0) {
      return {
        awbFee: 25, // default AWB fee if settings not loaded
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
    calculateCargoFees,
    calculatePickupFee,
    getRoutePricing,
    isLoading,
    settings
  };
}
