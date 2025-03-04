import React, { useEffect } from 'react';
import { Container } from '../../components/layout/Container';
import { AdminNav } from '../../components/admin/AdminNav';
import { CargoFeeSettings } from '../../components/admin/CargoFeeSettings';
import { PickupServiceSettings } from '../../components/admin/PickupServiceSettings';
import { CargoRoutePricing } from '../../components/admin/CargoRoutePriceSettings';
import { useAdminStore } from '../../stores/adminStore';

export default function AdminSettings() {
  const { loadSettings, settings, isLoading, error } = useAdminStore();
  
  useEffect(() => {
    console.log("🔍 [AdminSettingsPage] Component mounted, calling loadSettings");
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (settings) {
      console.log("🔍 [AdminSettingsPage] Settings loaded:", settings);
    }
  }, [settings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded mb-6">
            Error loading settings: {error}
          </div>
        )}
        
        {isLoading && !settings ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <CargoFeeSettings />
            <CargoRoutePricing />
            <PickupServiceSettings />
          </div>
        )}
      </Container>
    </div>
  );
}