import React from 'react';
import { FormInput } from '../../auth/FormInput';
import { Mail, Phone, User } from 'lucide-react';

interface ContactDetailsProps {
  values: {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
  };
  onChange: (field: string, value: string) => void;
}

export function ContactDetails({ values, onChange }: ContactDetailsProps) {
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(field, e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        <p className="text-sm text-gray-500 mt-1">
          We'll use these details to send your booking confirmation and updates
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative">
            <FormInput
              label="Contact Name"
              type="text"
              value={values.contactName}
              onChange={handleChange('contactName')}
              placeholder="Full name of main contact"
              required
              className="pl-10"
            />
            <User className="absolute left-3 top-[34px] h-5 w-5 text-gray-400" />
          </div>

          <div className="relative">
            <FormInput
              label="Contact Phone"
              type="tel"
              value={values.contactPhone}
              onChange={handleChange('contactPhone')}
              placeholder="e.g., +670 123 4567"
              required
              className="pl-10"
            />
            <Phone className="absolute left-3 top-[34px] h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <FormInput
            label="Contact Email"
            type="email"
            value={values.contactEmail}
            onChange={handleChange('contactEmail')}
            placeholder="Email for booking confirmation"
            required
            className="pl-10"
          />
          <Mail className="absolute left-3 top-[34px] h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}