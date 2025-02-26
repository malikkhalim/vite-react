import React from 'react';
import { ContactDetails } from '../../types/cargo';

interface ContactDetailsFormProps {
  type: 'shipper' | 'consignee';
  value: ContactDetails;
  onChange: (details: ContactDetails) => void;
}

export function ContactDetailsForm({ type, value, onChange }: ContactDetailsFormProps) {
  const handleChange = (field: keyof ContactDetails, fieldValue: string) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 capitalize">
        {type} Details
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={value.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person
          </label>
          <input
            type="text"
            value={value.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={value.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            value={value.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            value={value.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            required
          />
        </div>

        {type === 'consignee' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              TIN Number (Optional)
            </label>
            <input
              type="text"
              value={value.tin || ''}
              onChange={(e) => handleChange('tin', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        )}
      </div>
    </div>
  );
}