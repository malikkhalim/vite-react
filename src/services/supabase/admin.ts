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
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching settings:', error);
        return { data: null, error: error.message };
      }
      
      if (!data) {
        console.log('No settings found in database');
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
      const { data: currentSettings, error: fetchError } = await this.getSettings();
      
      if (fetchError) {
        console.error('Error fetching current settings:', fetchError);
        return { data: null, error: fetchError };
      }
      
      if (!currentSettings) {
        console.error('No settings found to update');
        return { data: null, error: 'No settings found to update' };
      }
      
      // Update only the cargo fees portion
      const { data, error } = await supabase
        .from('admin_settings')
        .update({
          cargo_fees: cargoFees
        })
        .eq('id', 1)
        .select();
      
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
      const { data: currentSettings, error: fetchError } = await this.getSettings();
      
      if (fetchError) {
        console.error('Error fetching current settings:', fetchError);
        return { data: null, error: fetchError };
      }
      
      if (!currentSettings) {
        console.error('No settings found to update');
        return { data: null, error: 'No settings found to update' };
      }
      
      // Update only the pickup service portion
      const { data, error } = await supabase
        .from('admin_settings')
        .update({
          pickup_service: pickupService
        })
        .eq('id', 1)
        .select();
      
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
      const { data: currentSettings, error: fetchError } = await this.getSettings();
      
      if (fetchError) {
        console.error('Error fetching current settings:', fetchError);
        return { data: null, error: fetchError };
      }
      
      if (!currentSettings) {
        console.error('No settings found to update');
        return { data: null, error: 'No settings found to update' };
      }
      
      // Update only the cargo route prices portion
      const { data, error } = await supabase
        .from('admin_settings')
        .update({
          cargo_route_prices: cargoRoutePrices
        })
        .eq('id', 1)
        .select();
      
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
      
      // Check if settings exist first
      const { count, error: countError } = await supabase
        .from('admin_settings')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error checking for existing settings:', countError);
        return { data: null, error: countError.message };
      }
      
      let result;
      
      // If settings don't exist, insert them
      if (count === 0) {
        console.log("No settings found, creating new settings record");
        result = await supabase
          .from('admin_settings')
          .insert({
            id: 1,
            cargo_fees: defaultSettings.cargoFees,
            pickup_service: defaultSettings.pickupService,
            cargo_route_prices: defaultSettings.cargoRoutePrices
          })
          .select();
      } else {
        // Otherwise, update the existing record
        console.log("Settings record exists, updating with default values");
        result = await supabase
          .from('admin_settings')
          .update({
            cargo_fees: defaultSettings.cargoFees,
            pickup_service: defaultSettings.pickupService,
            cargo_route_prices: defaultSettings.cargoRoutePrices
          })
          .eq('id', 1)
          .select();
      }
      
      if (result.error) {
        console.error('Error initializing settings:', result.error);
        return { data: null, error: result.error.message };
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