import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { PackageType, PackageDetails } from '../../types/cargo';

interface PackageListProps {
  packages: PackageDetails[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, pkg: PackageDetails) => void;
}

export function PackageList({ packages, onAdd, onRemove, onChange }: PackageListProps) {
  const packageTypes: { value: PackageType; label: string }[] = [
    { value: 'box', label: 'Box' },
    { value: 'pallet', label: 'Pallet' },
    { value: 'container', label: 'Container' },
    { value: 'crate', label: 'Crate' },
    { value: 'drum', label: 'Drum' },
    { value: 'bag', label: 'Bag' }
  ];

  const handleWeightChange = (index: number, pkg: PackageDetails, value: string) => {
    // Allow empty string for better typing experience
    if (value === '') {
      onChange(index, { ...pkg, weight: 0 });
      return;
    }

    // Only allow whole numbers
    if (!/^\d*$/.test(value)) return;

    // Convert to number and update
    const numValue = parseInt(value);
    if (isNaN(numValue)) return;
    
    onChange(index, { ...pkg, weight: numValue });
  };

  const handleDimensionChange = (
    index: number,
    pkg: PackageDetails,
    dimension: 'length' | 'width' | 'height',
    value: string
  ) => {
    if (value === '') {
      onChange(index, {
        ...pkg,
        dimensions: { ...pkg.dimensions, [dimension]: 0 }
      });
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    onChange(index, {
      ...pkg,
      dimensions: { ...pkg.dimensions, [dimension]: numValue }
    });
  };

  const handleQuantityChange = (index: number, pkg: PackageDetails, value: string) => {
    if (value === '') {
      onChange(index, { ...pkg, quantity: 0 });
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue)) return;

    onChange(index, { ...pkg, quantity: numValue });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="font-medium text-gray-700">Packages</h4>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 text-sky-600 hover:text-sky-700"
        >
          <Plus className="h-4 w-4" />
          Add Package
        </button>
      </div>

      {packages.map((pkg, index) => (
        <div key={index} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between">
            <h5 className="font-medium">Package {index + 1}</h5>
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Type</label>
              <select
                value={pkg.type}
                onChange={(e) => onChange(index, { ...pkg, type: e.target.value as PackageType })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {packageTypes.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Quantity</label>
              <input
                type="text"
                inputMode="numeric"
                value={pkg.quantity || ''}
                onChange={(e) => handleQuantityChange(index, pkg, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Weight (kg)
                <span className="text-xs text-gray-500 ml-1">
                  (whole numbers only)
                </span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={pkg.weight || ''}
                onChange={(e) => handleWeightChange(index, pkg, e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Enter weight"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">L (cm)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={pkg.dimensions.length || ''}
                  onChange={(e) => handleDimensionChange(index, pkg, 'length', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Length"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">W (cm)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={pkg.dimensions.width || ''}
                  onChange={(e) => handleDimensionChange(index, pkg, 'width', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Width"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">H (cm)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={pkg.dimensions.height || ''}
                  onChange={(e) => handleDimensionChange(index, pkg, 'height', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Height"
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <input
                type="text"
                value={pkg.description}
                onChange={(e) => onChange(index, { ...pkg, description: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Package contents..."
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}