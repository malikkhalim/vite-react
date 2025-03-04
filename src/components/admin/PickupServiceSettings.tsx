import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../stores/adminStore';

export function PickupServiceSettings() {
  const { settings, updatePickupService, loadSettings, isLoading, error } = useAdminStore();
  const [pickupService, setPickupService] = useState({
    baseWeight: 45,
    basePrice: 80,
    additionalPricePerKg: 2,
  });

  // Load settings if they aren't already loaded
  useEffect(() => {
    if (!settings && !isLoading) {
      loadSettings();
    }
  }, [settings, isLoading, loadSettings]);

  // Update local state when settings are loaded
  useEffect(() => {
    if (settings?.pickupService) {
      setPickupService(settings.pickupService);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting pickup service settings:', pickupService);
    await updatePickupService(pickupService);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Pickup Service Settings
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Weight (kg)
            </label>
            <input
              type="number"
              value={pickupService.baseWeight}
              onChange={(e) =>
                setPickupService({
                  ...pickupService,
                  baseWeight: parseInt(e.target.value) || 0,
                })
              }
              min="0"
              className="px-4 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Base Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={pickupService.basePrice}
                onChange={(e) =>
                  setPickupService({
                    ...pickupService,
                    basePrice: parseFloat(e.target.value) || 0,
                  })
                }
                step="0.01"
                min="0"
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Price (per kg)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={pickupService.additionalPricePerKg}
                onChange={(e) =>
                  setPickupService({
                    ...pickupService,
                    additionalPricePerKg: parseFloat(e.target.value) || 0,
                  })
                }
                step="0.01"
                min="0"
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}