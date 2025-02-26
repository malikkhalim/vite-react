import React from 'react';
import { FormInput } from '../../auth/FormInput';
import { SalutationSelect } from './SalutationSelect';
import { CountrySelect } from './CountrySelect';
import { PassengerType } from '../../../types/flight';
import { PASSENGER_TYPES } from '../../../constants/passengers';

interface PassengerDetailsProps {
  index: number;
  type: PassengerType;
  onChange: (index: number, field: string, value: string) => void;
  values: {
    salutation: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    passportNumber: string;
    passportExpiry: string;
    country: string;
  };
}

export function PassengerDetails({ index, type, onChange, values }: PassengerDetailsProps) {
  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(index, field, e.target.value);
  };

  const typeInfo = PASSENGER_TYPES[type];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Passenger {index + 1}
          </h3>
          <p className="text-sm text-gray-500">
            {typeInfo.label} ({typeInfo.ageRange})
          </p>
        </div>
        <div className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium">
          {typeInfo.label}
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Personal Information</h4>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <SalutationSelect
                value={values.salutation}
                onChange={(value) => onChange(index, 'salutation', value)}
                type={type}
              />
            </div>

            <div className="md:col-span-3 grid md:grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                type="text"
                value={values.firstName}
                onChange={handleChange('firstName')}
                placeholder="As shown on passport"
                required
              />

              <FormInput
                label="Last Name"
                type="text"
                value={values.lastName}
                onChange={handleChange('lastName')}
                placeholder="As shown on passport"
                required
              />
            </div>

            <div className="md:col-span-2">
              <FormInput
                label="Date of Birth"
                type="date"
                value={values.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="md:col-span-2">
              <CountrySelect
                value={values.country}
                onChange={(value) => onChange(index, 'country', value)}
              />
            </div>
          </div>
        </div>

        {/* Passport Information */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Passport Details</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <FormInput
              label="Passport Number"
              type="text"
              value={values.passportNumber}
              onChange={handleChange('passportNumber')}
              placeholder="Enter passport number"
              required
            />

            <FormInput
              label="Passport Expiry Date"
              type="date"
              value={values.passportExpiry}
              onChange={handleChange('passportExpiry')}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}