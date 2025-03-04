import { supabase } from './config';
import { AdminSettings } from '../../types/admin';

export interface SettingsResponse {
  data: AdminSettings | null;
  error: string | null;
}

export const settingsService = {
  async getSettings(): Promise<SettingsResponse> {
    console.log("Fetching settings from DB");
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching settings:', error);
        return { data: null, error: error.message };
      }
      
      if (!data) {
        return { data: null, error: 'No settings found' };
      }
      
      // Convert database fields to AdminSettings format
      const settings: AdminSettings = {
        cargoFees: data.cargo_fees,
        pickupService: data.pickup_service,
        cargoRoutePrices: data.cargo_route_prices || []
      };
      
      console.log("Settings retrieved successfully:", settings);
      return { data: settings, error: null };
    } catch (error) {
      console.error('Unexpected error fetching settings:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error fetching settings' 
      };
    }
  },
  
  async updateCargoFees(cargoFees: AdminSettings['cargoFees']): Promise<SettingsResponse> {
    try {
      console.log("Updating cargo fees:", cargoFees);
      
      // First get the current settings
      const { data: currentSettings } = await this.getSettings();
      
      if (!currentSettings) {
        return { data: null, error: 'No settings found to update' };
      }
      
      // Update only the cargo fees portion
      const { error } = await supabase
        .from('admin_settings')
        .update({
          cargo_fees: cargoFees
        })
        .eq('id', 1);
      
      if (error) {
        console.error('Error updating cargo fees:', error);
        return { data: null, error: error.message };
      }
      
      // Return the updated settings
      const updatedSettings = {
        ...currentSettings,
        cargoFees
      };
      
      console.log("Cargo fees updated successfully:", updatedSettings);
      return { data: updatedSettings, error: null };
    } catch (error) {
      console.error('Unexpected error updating cargo fees:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error updating cargo fees' 
      };
    }
  },
  
  async updatePickupService(pickupService: AdminSettings['pickupService']): Promise<SettingsResponse> {
    try {
      console.log("Updating pickup service:", pickupService);
      
      // First get the current settings
      const { data: currentSettings } = await this.getSettings();
      
      if (!currentSettings) {
        return { data: null, error: 'No settings found to update' };
      }
      
      // Update only the pickup service portion
      const { error } = await supabase
        .from('admin_settings')
        .update({
          pickup_service: pickupService
        })
        .eq('id', 1);
      
      if (error) {
        console.error('Error updating pickup service:', error);
        return { data: null, error: error.message };
      }
      
      // Return the updated settings
      const updatedSettings = {
        ...currentSettings,
        pickupService
      };
      
      console.log("Pickup service updated successfully:", updatedSettings);
      return { data: updatedSettings, error: null };
    } catch (error) {
      console.error('Unexpected error updating pickup service:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error updating pickup service' 
      };
    }
  },
  
  async updateRoutes(cargoRoutePrices: AdminSettings['cargoRoutePrices']): Promise<SettingsResponse> {
    try {
      console.log("Updating cargo routes:", cargoRoutePrices);
      
      // First get the current settings
      const { data: currentSettings } = await this.getSettings();
      
      if (!currentSettings) {
        return { data: null, error: 'No settings found to update' };
      }
      
      // Update only the cargo route prices portion
      const { error } = await supabase
        .from('admin_settings')
        .update({
          cargo_route_prices: cargoRoutePrices
        })
        .eq('id', 1);
      
      if (error) {
        console.error('Error updating cargo routes:', error);
        return { data: null, error: error.message };
      }
      
      // Return the updated settings
      const updatedSettings = {
        ...currentSettings,
        cargoRoutePrices
      };
      
      console.log("Cargo routes updated successfully:", updatedSettings);
      return { data: updatedSettings, error: null };
    } catch (error) {
      console.error('Unexpected error updating cargo routes:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error updating cargo routes' 
      };
    }
  },
  
  async initializeSettings(): Promise<SettingsResponse> {
    try {
      console.log("Initializing settings");
      
      // Check if settings already exist
      const { data: existingSettings } = await this.getSettings();
      
      if (existingSettings) {
        return { data: existingSettings, error: null };
      }
      
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
      
      const { error } = await supabase
        .from('admin_settings')
        .insert({
          id: 1,
          cargo_fees: defaultSettings.cargoFees,
          pickup_service: defaultSettings.pickupService,
          cargo_route_prices: defaultSettings.cargoRoutePrices
        });
      
      if (error) {
        console.error('Error initializing settings:', error);
        return { data: null, error: error.message };
      }
      
      console.log("Settings initialized successfully:", defaultSettings);
      return { data: defaultSettings, error: null };
    } catch (error) {
      console.error('Unexpected error initializing settings:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown error initializing settings' 
      };
    }
  }
};