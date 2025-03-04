import React, { useState, useEffect } from 'react';
import { useAdminStore } from '../../stores/adminStore';

export function CargoFeeSettings() {
  const { settings, updateCargoFees, loadSettings, isLoading, error } = useAdminStore();
  const [fees, setFees] = useState({
    awbFee: 25,
    screeningFeePerKg: 0.15,
    handlingFeePerKg: 0.25,
    cargoChargePerKg: 2.5,
  });

  // Load settings if they aren't already loaded
  useEffect(() => {
    if (!settings && !isLoading) {
      loadSettings();
    }
  }, [settings, isLoading, loadSettings]);

  // Update local state when settings are loaded
  useEffect(() => {
    if (settings?.cargoFees) {
      setFees(settings.cargoFees);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting cargo fees:', fees);
    await updateCargoFees(fees);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Cargo Fees</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              AWB Fee
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={fees.awbFee}
                onChange={(e) =>
                  setFees({ ...fees, awbFee: parseFloat(e.target.value) || 0 })
                }
                step="0.01"
                min="0"
                className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Screening Fee (per kg)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={fees.screeningFeePerKg}
                onChange={(e) =>
                  setFees({
                    ...fees,
                    screeningFeePerKg: parseFloat(e.target.value) || 0,
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
              Handling Fee (per kg)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={fees.handlingFeePerKg}
                onChange={(e) =>
                  setFees({
                    ...fees,
                    handlingFeePerKg: parseFloat(e.target.value) || 0,
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
              Cargo Charge (per kg)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                value={fees.cargoChargePerKg}
                onChange={(e) =>
                  setFees({
                    ...fees,
                    cargoChargePerKg: parseFloat(e.target.value) || 0,
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