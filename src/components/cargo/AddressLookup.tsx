import React, { useState, useEffect } from 'react';
import { Search, Loader2, MapPin, AlertCircle } from 'lucide-react';
import { useAddressLookup } from '../../hooks/useAddressLookup';
import { validatePostalCode } from '../../utils/cargo/validation';

interface AddressLookupProps {
  value: string;
  onChange: (address: string) => void;
  onContactChange: (contact: { name: string; phone: string }) => void;
}

export function AddressLookup({ value, onChange, onContactChange }: AddressLookupProps) {
  const [postalCode, setPostalCode] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [remarks, setRemarks] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [touched, setTouched] = useState(false);
  
  const { 
    address, 
    loading, 
    error, 
    lookupAddress 
  } = useAddressLookup();

  // Auto-lookup when postal code is complete
  useEffect(() => {
    if (validatePostalCode(postalCode) && touched) {
      lookupAddress(postalCode);
    }
  }, [postalCode, touched]);

  // Update parent component when form is complete
  useEffect(() => {
    if (address && unitNumber && contactName && contactPhone) {
      const fullAddress = [
        unitNumber,
        address,
        remarks,
        `Singapore ${postalCode}`,
      ].filter(Boolean).join(', ');

      onChange(fullAddress);
      onContactChange({ name: contactName, phone: contactPhone });
    }
  }, [address, unitNumber, remarks, contactName, contactPhone]);

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPostalCode(value);
    setTouched(true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d+\-\s]/g, '');
    setContactPhone(value);
  };

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Postal Code Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={postalCode}
              onChange={handlePostalCodeChange}
              className="w-full border border-gray-300 rounded-md pl-10 pr-10 py-2"
              placeholder="Enter 6-digit postal code"
              required
            />
            {loading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>
          {error && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
        </div>

        {/* Unit Number */}
        {address && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={unitNumber}
              onChange={(e) => setUnitNumber(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g., #01-01"
              required
            />
          </div>
        )}
      </div>

      {/* Address Display */}
      {address && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
              {address}
            </div>
          </div>

          {/* Additional Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Building access instructions, landmarks, etc."
            />
          </div>

          {/* Contact Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Name of person to contact"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={contactPhone}
                onChange={handlePhoneChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="+65 XXXX XXXX"
                required
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}