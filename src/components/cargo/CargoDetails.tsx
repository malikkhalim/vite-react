import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { CargoSearchData, CargoDetails as CargoDetailsType, CargoType, PackageDetails } from '../../types/cargo';
import { CargoTypeSelect } from './CargoTypeSelect';
import { PackageList } from './PackageList';
import { CargoDocumentUpload } from './CargoDocumentUpload';

interface CargoDetailsProps {
  searchData: CargoSearchData;
  onSubmit: (data: CargoDetailsType) => void;
}

const defaultPackage: PackageDetails = {
  type: 'box',
  quantity: 1,
  weight: 0,
  dimensions: { length: 0, width: 0, height: 0 },
  description: ''
};

export function CargoDetails({ searchData, onSubmit }: CargoDetailsProps) {
  const [cargoType, setCargoType] = useState<CargoType>('general');
  const [packages, setPackages] = useState<PackageDetails[]>([{ ...defaultPackage }]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleAddPackage = () => {
    setPackages([...packages, { ...defaultPackage }]);
  };

  const handleRemovePackage = (index: number) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handlePackageChange = (index: number, pkg: PackageDetails) => {
    setPackages(packages.map((p, i) => i === index ? pkg : p));
  };

  const handleFileUpload = (files: FileList) => {
    // Handle file upload logic here
    console.log('Files to upload:', files);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    onSubmit({
      ...searchData,
      cargoType,
      packages,
      specialInstructions,
      dangerous: cargoType === 'dangerous'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <CargoTypeSelect value={cargoType} onChange={setCargoType} />
        
        <CargoDocumentUpload 
          cargoType={cargoType}
          onFileUpload={handleFileUpload}
        />
        
        <PackageList
          packages={packages}
          onAdd={handleAddPackage}
          onRemove={handleRemovePackage}
          onChange={handlePackageChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Instructions
          </label>
          <textarea
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Any special handling requirements..."
          />
        </div>

        {cargoType === 'dangerous' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Dangerous Goods Declaration Required</h4>
              <p className="text-sm text-yellow-700">
                Additional documentation will be required for dangerous goods shipping.
                Our team will contact you for the necessary paperwork.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-sky-600 text-white px-8 py-3 rounded-md hover:bg-sky-700 transition-colors"
        >
          Continue to Booking
        </button>
      </div>
    </form>
  );
}