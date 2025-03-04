import React, { useEffect } from 'react';
import { useAdminStore } from '../../stores/adminStore';
import { supabase } from '../../services/supabase/config';

export function AdminSettingsDebug() {
  const { settings, loadSettings, isLoading, error } = useAdminStore();

  useEffect(() => {
    console.log('🔄 [AdminSettingsDebug] Component mounted, triggering loadSettings');
    loadSettings();
  }, [loadSettings]);

  const reinitializeSettings = async () => {
    console.log('🔍 [AdminSettingsDebug] Attempting to initialize admin_settings table...');
    
    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .upsert({
          id: 1,
          cargo_fees: {
            awbFee: 25,
            screeningFeePerKg: 0.15,
            handlingFeePerKg: 0.25,
            cargoChargePerKg: 2.5
          },
          pickup_service: {
            baseWeight: 45,
            basePrice: 80,
            additionalPricePerKg: 2
          },
          cargo_route_prices: []
        });
      
      if (error) {
        console.error('❌ [AdminSettingsDebug] Error initializing settings:', error);
        alert(`Failed to initialize settings: ${error.message}`);
      } else {
        console.log('✅ [AdminSettingsDebug] Settings initialized successfully:', data);
        alert('Settings initialized successfully. Reloading...');
        loadSettings();
      }
    } catch (e) {
      console.error('❌ [AdminSettingsDebug] Exception during initialization:', e);
      alert(`Exception during initialization: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const inspectAdminTable = async () => {
    console.log('🔍 [AdminSettingsDebug] Inspecting admin_settings table...');
    
    try {
      // Check if the table exists
      const { data: tableInfo, error: tableError } = await supabase
        .rpc('check_table_exists', { table_name: 'admin_settings' });
      
      if (tableError) {
        console.error('❌ [AdminSettingsDebug] Error checking table:', tableError);
        alert(`Error checking table: ${tableError.message}`);
        return;
      }
      
      console.log('📊 [AdminSettingsDebug] Table exists check:', tableInfo);
      
      // Get all records from the table
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*');
      
      if (error) {
        console.error('❌ [AdminSettingsDebug] Error fetching table data:', error);
        alert(`Error fetching table data: ${error.message}`);
        return;
      }
      
      console.log('📊 [AdminSettingsDebug] Table data:', data);
      alert(`Table check results:\n${JSON.stringify(data, null, 2)}`);
    } catch (e) {
      console.error('❌ [AdminSettingsDebug] Exception during table inspection:', e);
      alert(`Exception during table inspection: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Admin Settings Debug
      </h2>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded border">
          <h3 className="font-medium mb-2">Current State</h3>
          <pre className="text-xs bg-black text-white p-3 rounded overflow-auto max-h-60">
            {JSON.stringify({
              isLoading,
              error,
              hasSettings: !!settings,
              settingsKeys: settings ? Object.keys(settings) : [],
              cargoFeesKeys: settings?.cargoFees ? Object.keys(settings.cargoFees) : [],
              pickupServiceKeys: settings?.pickupService ? Object.keys(settings.pickupService) : [],
              cargoRoutePricesLength: settings?.cargoRoutePrices?.length || 0,
            }, null, 2)}
          </pre>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            <h3 className="font-medium mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col space-y-2">
          <button
            type="button"
            onClick={() => loadSettings()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Reload Settings
          </button>
          
          <button
            type="button"
            onClick={inspectAdminTable}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            Inspect Admin Table
          </button>
          
          <button
            type="button"
            onClick={reinitializeSettings}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Reinitialize Settings
          </button>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded text-sm">
          <p>
            <strong>Debugging Instructions:</strong><br />
            1. Open browser console (F12 or Ctrl+Shift+J)<br />
            2. Look for error messages related to admin settings<br />
            3. Check if the settings are being loaded correctly<br />
            4. Use the buttons above to diagnose and fix issues
          </p>
        </div>
      </div>
    </div>
  );
}