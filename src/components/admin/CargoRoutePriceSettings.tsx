import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAdminStore } from '../../stores/adminStore';
import { CargoRoutePrice } from '../../types/admin';

export function CargoRoutePricing() {
  const { settings, addRoutePrice, updateRoutePrice, deleteRoutePrice, loadSettings, isLoading, error } = useAdminStore();
  const [routes, setRoutes] = useState<CargoRoutePrice[]>([]);
  const [editMode, setEditMode] = useState<number | null>(null);
  const [newRoute, setNewRoute] = useState<CargoRoutePrice>({
    from: '',
    to: '',
    prices: {
      general: 0,
      pharma: 0,
      perishable: 0,
      dangerous: 0,
      special: 0
    }
  });

  // Available airports
  const airports = [
    { code: 'DIL', name: 'Dili' },
    { code: 'SIN', name: 'Singapore' },
    { code: 'DRW', name: 'Darwin' },
    { code: 'DPS', name: 'Bali' },
    { code: 'OEC', name: 'Oecusse' }
  ];

  // Load settings if they aren't already loaded
  useEffect(() => {
    if (!settings && !isLoading) {
      loadSettings();
    }
  }, [settings, isLoading, loadSettings]);

  // Update local state when settings are loaded
  useEffect(() => {
    if (settings?.cargoRoutePrices) {
      setRoutes(settings.cargoRoutePrices);
    }
  }, [settings]);

  const handleAddRoute = async () => {
    if (!newRoute.from || !newRoute.to) {
      alert('Please select both origin and destination airports');
      return;
    }

    if (newRoute.from === newRoute.to) {
      alert('Origin and destination cannot be the same');
      return;
    }

    await addRoutePrice(newRoute);

    // Reset new route form
    setNewRoute({
      from: '',
      to: '',
      prices: {
        general: 0,
        pharma: 0,
        perishable: 0,
        dangerous: 0,
        special: 0
      }
    });
  };

  const handleSaveEdit = async (index: number) => {
    await updateRoutePrice(index, routes[index]);
    setEditMode(null);
  };

  const handleDeleteRoute = async (index: number) => {
    if (confirm('Are you sure you want to delete this route?')) {
      await deleteRoutePrice(index);
    }
  };

  const handlePriceChange = (
    index: number | null, 
    cargoType: keyof CargoRoutePrice['prices'], 
    value: string
  ) => {
    const priceValue = parseFloat(value) || 0;
    
    if (index === null) {
      // Updating new route
      setNewRoute({
        ...newRoute,
        prices: {
          ...newRoute.prices,
          [cargoType]: priceValue
        }
      });
    } else {
      // Updating existing route
      const updatedRoutes = [...routes];
      updatedRoutes[index] = {
        ...updatedRoutes[index],
        prices: {
          ...updatedRoutes[index].prices,
          [cargoType]: priceValue
        }
      };
      setRoutes(updatedRoutes);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Route-based Cargo Pricing</h2>
        <button
          type="button"
          onClick={() => setEditMode(null)}
          className="text-sky-600 hover:text-sky-700 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Route
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Add New Route Form */}
      {editMode === null && (
        <div className="border rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-4">Add New Route</h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <select
                value={newRoute.from}
                onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Origin</option>
                {airports.map((airport) => (
                  <option key={`from-${airport.code}`} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
              <select
                value={newRoute.to}
                onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select Destination</option>
                {airports.map((airport) => (
                  <option key={`to-${airport.code}`} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <h4 className="text-sm font-medium text-gray-700 mb-2">Pricing ($ per kg)</h4>
          <div className="grid md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">General</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={newRoute.prices.general || ''}
                  onChange={(e) => handlePriceChange(null, 'general', e.target.value)}
                  step="0.01"
                  min="0"
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Pharma</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={newRoute.prices.pharma || ''}
                  onChange={(e) => handlePriceChange(null, 'pharma', e.target.value)}
                  step="0.01"
                  min="0"
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Perishable</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={newRoute.prices.perishable || ''}
                  onChange={(e) => handlePriceChange(null, 'perishable', e.target.value)}
                  step="0.01"
                  min="0"
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Dangerous</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={newRoute.prices.dangerous || ''}
                  onChange={(e) => handlePriceChange(null, 'dangerous', e.target.value)}
                  step="0.01"
                  min="0"
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Special</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={newRoute.prices.special || ''}
                  onChange={(e) => handlePriceChange(null, 'special', e.target.value)}
                  step="0.01"
                  min="0"
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-md w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddRoute}
              disabled={isLoading}
              className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Adding...' : 'Add Route'}
            </button>
          </div>
        </div>
      )}

      {/* List of Routes */}
      {routes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">General</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Pharma</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Perishable</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Dangerous</th>
                <th className="text-center p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Special</th>
                <th className="text-right p-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {routes.map((route, index) => (
                <tr key={`${route.from}-${route.to}`} className="hover:bg-gray-50">
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-medium">{route.from} → {route.to}</div>
                  </td>
                  
                  {editMode === index ? (
                    <>
                      <td className="p-3">
                        <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={routes[index].prices.general || ''}
                            onChange={(e) => handlePriceChange(index, 'general', e.target.value)}
                            step="0.01"
                            min="0"
                            className="pl-8 pr-2 py-1 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={routes[index].prices.pharma || ''}
                            onChange={(e) => handlePriceChange(index, 'pharma', e.target.value)}
                            step="0.01"
                            min="0"
                            className="pl-8 pr-2 py-1 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={routes[index].prices.perishable || ''}
                            onChange={(e) => handlePriceChange(index, 'perishable', e.target.value)}
                            step="0.01"
                            min="0"
                            className="pl-8 pr-2 py-1 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={routes[index].prices.dangerous || ''}
                            onChange={(e) => handlePriceChange(index, 'dangerous', e.target.value)}
                            step="0.01"
                            min="0"
                            className="pl-8 pr-2 py-1 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={routes[index].prices.special || ''}
                            onChange={(e) => handlePriceChange(index, 'special', e.target.value)}
                            step="0.01"
                            min="0"
                            className="pl-8 pr-2 py-1 border border-gray-300 rounded-md w-full"
                          />
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(index)}
                          disabled={isLoading}
                          className="text-sky-600 hover:text-sky-800 mr-2"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditMode(null)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 text-center">${route.prices.general.toFixed(2)}</td>
                      <td className="p-3 text-center">${route.prices.pharma.toFixed(2)}</td>
                      <td className="p-3 text-center">${route.prices.perishable.toFixed(2)}</td>
                      <td className="p-3 text-center">${route.prices.dangerous.toFixed(2)}</td>
                      <td className="p-3 text-center">${route.prices.special.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => setEditMode(index)}
                          className="text-sky-600 hover:text-sky-800 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteRoute(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4 inline" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500">
          No routes added yet. Add a route above.
        </div>
      )}
    </div>
  );
}
