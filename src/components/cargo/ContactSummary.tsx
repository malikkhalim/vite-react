import React from 'react';
import { User } from 'lucide-react';
import type { ContactDetails } from '../../types/cargo';

interface ContactSummaryProps {
  shipper: ContactDetails;
  consignee: ContactDetails;
}

export function ContactSummary({ shipper, consignee }: ContactSummaryProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <User className="h-5 w-5" />
        Contact Details
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipper Details */}
        <div>
          <h4 className="font-medium mb-2">Shipper</h4>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-600">Company:</span> {shipper.companyName}</p>
            <p><span className="text-gray-600">Contact:</span> {shipper.contactPerson}</p>
            <p><span className="text-gray-600">Email:</span> {shipper.email}</p>
            <p><span className="text-gray-600">Phone:</span> {shipper.phone}</p>
            <p><span className="text-gray-600">Address:</span> {shipper.address}</p>
          </div>
        </div>

        {/* Consignee Details */}
        <div>
          <h4 className="font-medium mb-2">Consignee</h4>
          <div className="space-y-2 text-sm">
            <p><span className="text-gray-600">Company:</span> {consignee.companyName}</p>
            <p><span className="text-gray-600">Contact:</span> {consignee.contactPerson}</p>
            <p><span className="text-gray-600">Email:</span> {consignee.email}</p>
            <p><span className="text-gray-600">Phone:</span> {consignee.phone}</p>
            <p><span className="text-gray-600">Address:</span> {consignee.address}</p>
            {consignee.tin && (
              <p><span className="text-gray-600">TIN:</span> {consignee.tin}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}