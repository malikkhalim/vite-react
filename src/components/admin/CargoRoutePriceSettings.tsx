import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../stores/adminStore';
import { CARGO_ROUTES } from '../../constants/routes';
import { CargoRoutePrice } from '../../types/admin';

export function CargoRoutePriceSettings() {
  const { settings, updateSettings } = useAdminStore();
  const [routePrices, setRoutePrices] = useState<CargoRoutePrice[]>(
    settings?.cargoRoutePrices || []
  );

  const handleAddRoute = () => {
    setRoutePrices([
      ...routePrices,
      {
        from: 'SIN',
        to: 'DIL',
        prices: {
          general: 0,
          pharma: 0,
          perishable: 0,
          dangerous: 0,
          special: 0
        }
      }
    ]);
  };

  const handleRemoveRoute = (index: number) => {
    setRoutePrices(routePrices.filter((_, i) => i !== index));
  };

  const handleRouteChange = (index: number, field: 'from' | 'to', value: string) => {
    setRoutePrices(routePrices.map((route, i) => {
      if (i === index) {
        return { ...route, [field]: value };
      }
      return route;
    }));
  };

  const handlePriceChange = (index: number, type: keyof CargoRoutePrice['prices'], value: string) => {
    const numValue = parseFloat(value) || 0;
    setRoutePrices(routePrices.map((route, i) => {
      if (i === index) {
        return {
          ...route,
          prices: { ...route.prices, [type]: numValue }
        };
      }
      return route;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    await updateSettings({
      ...settings,
      cargoRoutePrices: routePrices
    });
  };

  const getAvailableDestinations = (from: string) => {
    return CARGO_ROUTES[from as keyof typeof CARGO_ROUTES] || [];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Route-based Cargo Pricing</h2>
        <button
          type="button"
          onClick={handleAddRoute}
          className="flex items-center gap-2 text-sky-600 hover:text-sky-700"
        >
          <Plus className="h-4 w-4" />
          Add Route
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {routePrices.map((route, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="grid md:grid-cols-2 gap-4 flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <select
                    value={route.from}
                    onChange={(e) => handleRouteChange(index, 'from', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {Object.keys(CARGO_ROUTES).map((origin) => (
                      <option key={origin} value={origin}>{origin}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <select
                    value={route.to}
                    onChange={(e) => handleRouteChange(index, 'to', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {getAvailableDestinations(route.from).map((dest) => (
                      <option key={dest} value={dest}>{dest}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveRoute(index)}
                className="ml-4 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-5 gap-4">
              {Object.entries(route.prices).map(([type, price]) => (
                <div key={type}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {type} ($/kg)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => handlePriceChange(index, type as keyof CargoRoutePrice['prices'], e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}