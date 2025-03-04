import React, { useEffect } from 'react';
import { Container } from '../../components/layout/Container';
import { AdminNav } from '../../components/admin/AdminNav';
import { CargoFeeSettings } from '../../components/admin/CargoFeeSettings';
import { PickupServiceSettings } from '../../components/admin/PickupServiceSettings';
import { CargoRoutePricing } from '../../components/admin/CargoRoutePriceSettings';
import { useAdminStore } from '../../stores/adminStore';

export default function AdminSettings() {
  const { loadSettings } = useAdminStore();
  
  // Load settings when the page loads
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <Container className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
        
        <div className="space-y-8">
          <CargoFeeSettings />
          <CargoRoutePricing />
          <PickupServiceSettings />
        </div>
      </Container>
    </div>
  );
}