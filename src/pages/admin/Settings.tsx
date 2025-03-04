// src/pages/admin/Settings.tsx
import React, { useEffect, useState } from 'react';
import { Container } from '../../components/layout/Container';
import { AdminNav } from '../../components/admin/AdminNav';
import { CargoFeeSettings } from '../../components/admin/CargoFeeSettings';
import { PickupServiceSettings } from '../../components/admin/PickupServiceSettings';
import { CargoRoutePricing } from '../../components/admin/CargoRoutePriceSettings';
import { useAdminStore } from '../../stores/adminStore';

export default function AdminSettings() {
  // Get what we need from the store
  const { 
    settings, 
    isLoading, 
    error, 
    loadSettings, 
    clearError, 
    resetStore, 
    loadAttempts 
  } = useAdminStore();
  
  // Local state for tracking component mounting
  const [hasMounted, setHasMounted] = useState(false);
  const [loadingTooLong, setLoadingTooLong] = useState(false);
  
  // Setup loading timeout detector
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      timeoutId = setTimeout(() => {
        setLoadingTooLong(true);
      },
      5000); // Show timeout UI after 5 seconds of loading
    } else {
      setLoadingTooLong(false);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);
  
  // Handle component mount - load settings only once
  useEffect(() => {
    // This will run only once when the component mounts
    if (!hasMounted) {
      console.log("AdminSettings component mounted, initiating load");
      setHasMounted(true);
      
      // Reset any previous errors
      clearError();
      
      // Initial load of settings
      loadSettings();
    }
  }, [hasMounted, loadSettings, clearError]);
  
  // Reset function for when things go wrong
  const handleResetAndReload = () => {
    console.log("Performing emergency reset");
    
    // Clear localStorage
    localStorage.removeItem('admin-settings-storage');
    
    // Reset the store
    resetStore();
    
    // Reload the page after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };
  
  // Function to retry loading settings
  const handleRetry = () => {
    console.log("Retrying settings load");
    clearError();
    setLoadingTooLong(false);
    loadSettings();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          
          {/* Emergency reset button */}
          <button
            onClick={handleResetAndReload}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-1 rounded"
            title="Emergency reset - use if settings won't load"
          >
            Reset Cache
          </button>
        </div>
        
        {/* Show error message if there is one */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error loading settings</p>
            <p className="text-sm mt-1">{error}</p>
            <div className="mt-3 flex space-x-2">
              <button 
                onClick={handleRetry}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Try Again
              </button>
              <button 
                onClick={handleResetAndReload}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Reset & Reload
              </button>
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && !settings ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings... (Attempt {loadAttempts})</p>
            
            {/* Show if loading takes too long */}
            {loadingTooLong && (
              <div className="mt-6 max-w-md mx-auto">
                <p className="text-amber-600 mb-2">This is taking longer than expected.</p>
                <p className="text-sm text-gray-600 mb-4">
                  There may be an issue with cached data or the database connection.
                </p>
                <div className="space-x-4">
                  <button 
                    onClick={handleRetry}
                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                  >
                    Try Again
                  </button>
                  <button 
                    onClick={handleResetAndReload}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                  >
                    Reset & Reload
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : settings ? (
          <div className="space-y-8">
            <CargoFeeSettings />
            <CargoRoutePricing />
            <PickupServiceSettings />
          </div>
        ) : null}
      </Container>
    </div>
  );
}