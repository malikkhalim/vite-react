import React from 'react';
import { Package, Pill, Apple, AlertTriangle, Briefcase } from 'lucide-react';
import { CargoType } from '../../types/cargo';

interface CargoTypeSelectProps {
  value: CargoType;
  onChange: (value: CargoType) => void;
}

export function CargoTypeSelect({ value, onChange }: CargoTypeSelectProps) {
  const cargoTypes = [
    { 
      id: 'general', 
      label: 'General Cargo',
      icon: Package,
      description: 'Standard cargo items'
    },
    { 
      id: 'pharma', 
      label: 'Pharmaceutical',
      icon: Pill,
      description: 'Temperature-controlled pharmaceuticals'
    },
    { 
      id: 'perishable', 
      label: 'Perishable',
      icon: Apple,
      description: 'Food and other perishable items'
    },
    { 
      id: 'dangerous', 
      label: 'Dangerous Goods',
      icon: AlertTriangle,
      description: 'Hazardous materials'
    },
    { 
      id: 'special', 
      label: 'Special Cargo',
      icon: Briefcase,
      description: 'Valuable or sensitive items'
    }
  ] as const;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Cargo Type</label>
      <div className="grid md:grid-cols-3 gap-4">
        {cargoTypes.map(({ id, label, icon: Icon, description }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id as CargoType)}
            className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${
              value === id
                ? 'border-sky-600 bg-sky-50 text-sky-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Icon className="h-6 w-6" />
            <span className="font-medium">{label}</span>
            <span className="text-sm text-gray-500 text-center">{description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}