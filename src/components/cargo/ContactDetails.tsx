import React, { useState } from 'react';
import { ContactDetails as ContactDetailsType, CargoDetails } from '../../types/cargo';
import { ContactDetailsForm } from './ContactDetailsForm';

interface ContactDetailsProps {
  cargoDetails: CargoDetails;
  onSubmit: (shipper: ContactDetailsType, consignee: ContactDetailsType) => void;
}

const defaultContact: ContactDetailsType = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
};

export function ContactDetails({ cargoDetails, onSubmit }: ContactDetailsProps) {
  const [shipper, setShipper] = useState<ContactDetailsType>(defaultContact);
  const [consignee, setConsignee] = useState<ContactDetailsType>(defaultContact);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(shipper, consignee);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
        <ContactDetailsForm
          type="shipper"
          value={shipper}
          onChange={setShipper}
        />
        
        <div className="border-t border-gray-200 pt-8">
          <ContactDetailsForm
            type="consignee"
            value={consignee}
            onChange={setConsignee}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-sky-600 text-white px-8 py-3 rounded-md hover:bg-sky-700 transition-colors"
        >
          Continue to Confirmation
        </button>
      </div>
    </form>
  );
}