import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminState, AdminSettings, CargoRoutePrice } from '../types/admin';
import { settingsService } from '../services/supabase/admin';

interface AdminStore extends AdminState {
  loadSettings: () => Promise<void>;
  updateCargoFees: (cargoFees: AdminSettings['cargoFees']) => Promise<void>;
  updatePickupService: (pickupService: AdminSettings['pickupService']) => Promise<void>;
  addRoutePrice: (routePrice: CargoRoutePrice) => Promise<void>;
  updateRoutePrice: (index: number, routePrice: CargoRoutePrice) => Promise<void>;
  deleteRoutePrice: (index: number) => Promise<void>;
  clearError: () => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      settings: null,
      isLoading: false,
      error: null,

      loadSettings: async () => {
        console.log("load settings Loaded");
        
        // If settings are already loaded from storage, skip the API call
        if (get().settings && !get().isLoading) {
          console.log("Using cached settings");
          return;
        }

        set({ isLoading: true, error: null });
        
        // First try to get settings
        const response = await settingsService.getSettings();
        
        // If no settings exist, try to initialize them
        if (!response.data && response.error === 'No settings found') {
          const initResponse = await settingsService.initializeSettings();
          
          if (initResponse.error) {
            set({ error: initResponse.error, isLoading: false });
            return;
          }
          
          set({ settings: initResponse.data, isLoading: false });
          console.log("Settings initialized", initResponse.data);
          return;
        }
        
        // Handle error from original request
        if (response.error) {
          set({ error: response.error, isLoading: false });
          return;
        }

        console.log("Settings loaded from DB", response.data);
        
        set({ settings: response.data, isLoading: false });
      },

      updateCargoFees: async (cargoFees: AdminSettings['cargoFees']) => {
        set({ isLoading: true, error: null });
        
        const response = await settingsService.updateCargoFees(cargoFees);
        
        if (response.error) {
          set({ error: response.error, isLoading: false });
          return;
        }
        
        set({ settings: response.data, isLoading: false });
        console.log("Cargo fees updated", response.data);
      },

      updatePickupService: async (pickupService: AdminSettings['pickupService']) => {
        set({ isLoading: true, error: null });
        
        const response = await settingsService.updatePickupService(pickupService);
        
        if (response.error) {
          set({ error: response.error, isLoading: false });
          return;
        }
        
        set({ settings: response.data, isLoading: false });
        console.log("Pickup service updated", response.data);
      },

      addRoutePrice: async (routePrice: CargoRoutePrice) => {
        set({ isLoading: true, error: null });
        
        const { settings } = get();
        if (!settings) {
          set({ error: 'No settings loaded', isLoading: false });
          return;
        }
        
        const newRoutePrices = [...(settings.cargoRoutePrices || []), routePrice];
        
        const response = await settingsService.updateRoutes(newRoutePrices);
        
        if (response.error) {
          set({ error: response.error, isLoading: false });
          return;
        }
        
        set({ settings: response.data, isLoading: false });
        console.log("Route price added", response.data);
      },

      updateRoutePrice: async (index: number, routePrice: CargoRoutePrice) => {
        set({ isLoading: true, error: null });
        
        const { settings } = get();
        if (!settings || !settings.cargoRoutePrices) {
          set({ error: 'No settings loaded', isLoading: false });
          return;
        }
        
        const newRoutePrices = [...settings.cargoRoutePrices];
        newRoutePrices[index] = routePrice;
        
        const response = await settingsService.updateRoutes(newRoutePrices);
        
        if (response.error) {
          set({ error: response.error, isLoading: false });
          return;
        }
        
        set({ settings: response.data, isLoading: false });
        console.log("Route price updated", response.data);
      },

      deleteRoutePrice: async (index: number) => {
        set({ isLoading: true, error: null });
        
        const { settings } = get();
        if (!settings || !settings.cargoRoutePrices) {
          set({ error: 'No settings loaded', isLoading: false });
          return;
        }
        
        const newRoutePrices = settings.cargoRoutePrices.filter((_, i) => i !== index);
        
        const response = await settingsService.updateRoutes(newRoutePrices);
        
        if (response.error) {
          set({ error: response.error, isLoading: false });
          return;
        }
        
        set({ settings: response.data, isLoading: false });
        console.log("Route price deleted", response.data);
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'admin-settings-storage',
      partialize: (state) => ({ settings: state.settings })
    }
  )
);