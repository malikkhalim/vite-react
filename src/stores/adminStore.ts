// src/stores/adminStore.ts
import { create } from 'zustand';
import { AdminSettings, CargoRoutePrice } from '../types/admin';
import { supabase } from '../services/supabase/config';

interface AdminState {
  settings: AdminSettings | null;
  isLoading: boolean;
  error: string | null;
  loadAttempts: number;
  lastLoadTime: number | null;
}

interface AdminActions {
  loadSettings: () => Promise<void>;
  updateCargoFees: (cargoFees: AdminSettings['cargoFees']) => Promise<void>;
  updatePickupService: (pickupService: AdminSettings['pickupService']) => Promise<void>;
  addRoutePrice: (routePrice: CargoRoutePrice) => Promise<void>;
  updateRoutePrice: (index: number, routePrice: CargoRoutePrice) => Promise<void>;
  deleteRoutePrice: (index: number) => Promise<void>;
  clearError: () => void;
  resetStore: () => void;
}

type AdminStore = AdminState & AdminActions;

// Create a new implementation of the admin store
export const useAdminStore = create<AdminStore>((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,
  loadAttempts: 0,
  lastLoadTime: null,

  loadSettings: async () => {
    // Circuit breaker pattern to prevent infinite loops
    const currentState = get();
    const now = Date.now();
    
    // If we've already tried loading multiple times in a short period, stop
    if (currentState.loadAttempts > 5 && 
        currentState.lastLoadTime && 
        (now - currentState.lastLoadTime < 10000)) {
      console.error("Circuit breaker: Too many load attempts in a short time");
      set({ 
        error: "Too many load attempts. Please try again later or clear your browser cache.",
        isLoading: false 
      });
      return;
    }

    // Don't start a new load if one is already in progress
    if (currentState.isLoading) {
      console.log("Already loading settings, skipping duplicate request");
      return;
    }
    
    set({ 
      isLoading: true, 
      error: null, 
      loadAttempts: currentState.loadAttempts + 1,
      lastLoadTime: now
    });

    console.log(`Loading settings... (attempt ${currentState.loadAttempts + 1})`);
    
    try {
      // Direct Supabase query with error handling
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .maybeSingle();
      
      if (error) {
        console.error("Supabase error loading settings:", error);
        set({ 
          error: `Database error: ${error.message}`, 
          isLoading: false 
        });
        return;
      }
      
      if (!data) {
        console.log("No settings found, initializing defaults");
        // Create default settings
        const defaultSettings: AdminSettings = {
          cargoFees: {
            awbFee: 25,
            screeningFeePerKg: 0.15,
            handlingFeePerKg: 0.25,
            cargoChargePerKg: 2.5
          },
          pickupService: {
            baseWeight: 45,
            basePrice: 80,
            additionalPricePerKg: 2
          },
          cargoRoutePrices: []
        };
        
        // Insert default settings
        const { error: insertError } = await supabase
          .from('admin_settings')
          .insert({
            id: 1,
            cargo_fees: defaultSettings.cargoFees,
            pickup_service: defaultSettings.pickupService,
            cargo_route_prices: defaultSettings.cargoRoutePrices
          });
        
        if (insertError) {
          console.error("Error initializing settings:", insertError);
          set({ 
            error: `Could not initialize settings: ${insertError.message}`,
            isLoading: false 
          });
          return;
        }
        
        set({ 
          settings: defaultSettings, 
          isLoading: false 
        });
        console.log("Default settings initialized successfully");
        return;
      }
      
      // Transform database format to app format
      const settings: AdminSettings = {
        cargoFees: data.cargo_fees || {
          awbFee: 25,
          screeningFeePerKg: 0.15,
          handlingFeePerKg: 0.25,
          cargoChargePerKg: 2.5
        },
        pickupService: data.pickup_service || {
          baseWeight: 45,
          basePrice: 80,
          additionalPricePerKg: 2
        },
        cargoRoutePrices: data.cargo_route_prices || []
      };
      
      console.log("Settings loaded successfully:", settings);
      set({ 
        settings,
        isLoading: false 
      });
    } catch (err) {
      console.error("Unexpected error loading settings:", err);
      set({ 
        error: err instanceof Error ? err.message : 'Unknown error loading settings',
        isLoading: false 
      });
    }
  },

  updateCargoFees: async (cargoFees) => {
    const currentState = get();
    if (currentState.isLoading) return;
    
    set({ isLoading: true, error: null });
    
    try {
      // Simple direct update
      const { error } = await supabase
        .from('admin_settings')
        .update({ cargo_fees: cargoFees })
        .eq('id', 1);
      
      if (error) {
        console.error("Error updating cargo fees:", error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      const newSettings = currentState.settings 
        ? { ...currentState.settings, cargoFees } 
        : null;
      
      set({ 
        settings: newSettings, 
        isLoading: false 
      });
      console.log("Cargo fees updated successfully");
    } catch (err) {
      console.error("Unexpected error updating cargo fees:", err);
      set({ 
        error: err instanceof Error ? err.message : 'Unknown error updating cargo fees',
        isLoading: false 
      });
    }
  },

  updatePickupService: async (pickupService) => {
    const currentState = get();
    if (currentState.isLoading) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const { error } = await supabase
        .from('admin_settings')
        .update({ pickup_service: pickupService })
        .eq('id', 1);
      
      if (error) {
        console.error("Error updating pickup service:", error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      const newSettings = currentState.settings 
        ? { ...currentState.settings, pickupService } 
        : null;
      
      set({ 
        settings: newSettings, 
        isLoading: false 
      });
      console.log("Pickup service updated successfully");
    } catch (err) {
      console.error("Unexpected error updating pickup service:", err);
      set({ 
        error: err instanceof Error ? err.message : 'Unknown error updating pickup service',
        isLoading: false 
      });
    }
  },

  addRoutePrice: async (routePrice) => {
    const currentState = get();
    if (currentState.isLoading || !currentState.settings) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const newRoutePrices = [...(currentState.settings.cargoRoutePrices || []), routePrice];
      
      const { error } = await supabase
        .from('admin_settings')
        .update({ cargo_route_prices: newRoutePrices })
        .eq('id', 1);
      
      if (error) {
        console.error("Error adding route price:", error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      const newSettings = {
        ...currentState.settings,
        cargoRoutePrices: newRoutePrices
      };
      
      set({ 
        settings: newSettings, 
        isLoading: false 
      });
      console.log("Route price added successfully");
    } catch (err) {
      console.error("Unexpected error adding route price:", err);
      set({ 
        error: err instanceof Error ? err.message : 'Unknown error adding route price',
        isLoading: false 
      });
    }
  },

  updateRoutePrice: async (index, routePrice) => {
    const currentState = get();
    if (currentState.isLoading || !currentState.settings || !currentState.settings.cargoRoutePrices) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const newRoutePrices = [...currentState.settings.cargoRoutePrices];
      newRoutePrices[index] = routePrice;
      
      const { error } = await supabase
        .from('admin_settings')
        .update({ cargo_route_prices: newRoutePrices })
        .eq('id', 1);
      
      if (error) {
        console.error("Error updating route price:", error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      const newSettings = {
        ...currentState.settings,
        cargoRoutePrices: newRoutePrices
      };
      
      set({ 
        settings: newSettings, 
        isLoading: false 
      });
      console.log("Route price updated successfully");
    } catch (err) {
      console.error("Unexpected error updating route price:", err);
      set({ 
        error: err instanceof Error ? err.message : 'Unknown error updating route price',
        isLoading: false 
      });
    }
  },

  deleteRoutePrice: async (index) => {
    const currentState = get();
    if (currentState.isLoading || !currentState.settings || !currentState.settings.cargoRoutePrices) return;
    
    set({ isLoading: true, error: null });
    
    try {
      const newRoutePrices = currentState.settings.cargoRoutePrices.filter((_, i) => i !== index);
      
      const { error } = await supabase
        .from('admin_settings')
        .update({ cargo_route_prices: newRoutePrices })
        .eq('id', 1);
      
      if (error) {
        console.error("Error deleting route price:", error);
        set({ error: error.message, isLoading: false });
        return;
      }
      
      const newSettings = {
        ...currentState.settings,
        cargoRoutePrices: newRoutePrices
      };
      
      set({ 
        settings: newSettings, 
        isLoading: false 
      });
      console.log("Route price deleted successfully");
    } catch (err) {
      console.error("Unexpected error deleting route price:", err);
      set({ 
        error: err instanceof Error ? err.message : 'Unknown error deleting route price',
        isLoading: false 
      });
    }
  },

  clearError: () => set({ error: null }),
  
  resetStore: () => set({ 
    settings: null, 
    isLoading: false, 
    error: null, 
    loadAttempts: 0,
    lastLoadTime: null
  })
}));