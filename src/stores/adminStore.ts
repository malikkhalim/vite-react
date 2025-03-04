import { create } from 'zustand';
import { AdminState, AdminSettings, CargoRoutePrice } from '../types/admin';
import { supabase } from '../services/supabase/config';

interface AdminStore extends AdminState {
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<AdminSettings>) => Promise<void>;
  updateCargoFees: (cargoFees: AdminSettings['cargoFees']) => Promise<void>;
  updatePickupService: (pickupService: AdminSettings['pickupService']) => Promise<void>;
  addRoutePrice: (routePrice: CargoRoutePrice) => Promise<void>;
  updateRoutePrice: (index: number, routePrice: CargoRoutePrice) => Promise<void>;
  deleteRoutePrice: (index: number) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  settings: null,
  isLoading: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Convert database fields to camelCase
      const settings: AdminSettings = {
        cargoFees: data.cargo_fees,
        pickupService: data.pickup_service,
        cargoRoutePrices: data.cargo_route_prices || []
      };
      
      set({ settings });
      console.log('Admin settings loaded successfully:', settings);
    } catch (error) {
      console.error('Failed to load admin settings:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateSettings: async (updatedSettings: Partial<AdminSettings>) => {
    set({ isLoading: true, error: null });
    try {
      const currentSettings = get().settings;
      if (!currentSettings) {
        throw new Error('No settings loaded. Please load settings first.');
      }

      // Merge current settings with updated settings
      const mergedSettings = {
        ...currentSettings,
        ...updatedSettings
      };

      // Convert to snake_case for database
      const { data, error } = await supabase
        .from('admin_settings')
        .update({
          cargo_fees: mergedSettings.cargoFees,
          pickup_service: mergedSettings.pickupService,
          cargo_route_prices: mergedSettings.cargoRoutePrices
        })
        .eq('id', 1);
      
      if (error) throw error;
      
      set({ settings: mergedSettings });
      console.log('Admin settings updated successfully:', mergedSettings);
    } catch (error) {
      console.error('Failed to update admin settings:', error);
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateCargoFees: async (cargoFees: AdminSettings['cargoFees']) => {
    const currentSettings = get().settings;
    if (!currentSettings) {
      set({ error: 'No settings loaded. Please load settings first.' });
      return;
    }

    return get().updateSettings({ cargoFees });
  },

  updatePickupService: async (pickupService: AdminSettings['pickupService']) => {
    const currentSettings = get().settings;
    if (!currentSettings) {
      set({ error: 'No settings loaded. Please load settings first.' });
      return;
    }

    return get().updateSettings({ pickupService });
  },

  addRoutePrice: async (routePrice: CargoRoutePrice) => {
    const currentSettings = get().settings;
    if (!currentSettings) {
      set({ error: 'No settings loaded. Please load settings first.' });
      return;
    }

    const newRoutePrices = [...(currentSettings.cargoRoutePrices || []), routePrice];
    return get().updateSettings({ cargoRoutePrices: newRoutePrices });
  },

  updateRoutePrice: async (index: number, routePrice: CargoRoutePrice) => {
    const currentSettings = get().settings;
    if (!currentSettings || !currentSettings.cargoRoutePrices) {
      set({ error: 'No settings loaded. Please load settings first.' });
      return;
    }

    const newRoutePrices = [...currentSettings.cargoRoutePrices];
    newRoutePrices[index] = routePrice;
    return get().updateSettings({ cargoRoutePrices: newRoutePrices });
  },

  deleteRoutePrice: async (index: number) => {
    const currentSettings = get().settings;
    if (!currentSettings || !currentSettings.cargoRoutePrices) {
      set({ error: 'No settings loaded. Please load settings first.' });
      return;
    }

    const newRoutePrices = currentSettings.cargoRoutePrices.filter((_, i) => i !== index);
    return get().updateSettings({ cargoRoutePrices: newRoutePrices });
  },

  clearError: () => set({ error: null })
}));