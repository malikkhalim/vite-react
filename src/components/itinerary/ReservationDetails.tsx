import React from 'react';

interface ReservationDetailsProps {
  reservation: {
    agencyName: string;
    referenceNumber: string;
    companyName: string;
    status: string;
    issueDate: string;
    bookingCode: string;
  };
}

export function ReservationDetails({ reservation }: ReservationDetailsProps) {
  return (
    <div className="mb-6">
      <div className="bg-red-600 text-white px-4 py-2 font-bold mb-4">
        Reservation Details
      </div>
      
      <div className="grid grid-cols-2 gap-x-8">
        <div className="space-y-2">
          <div>
            <p className="text-sm">Agency/Airline Name</p>
            <p>{reservation.referenceNumber}</p>
            <p>{reservation.companyName}</p>
          </div>
          <div>
            <p className="text-sm">Status</p>
            <p className="font-bold">{reservation.status}</p>
          </div>
        </div>
        
        <div className="text-right space-y-2">
          <div>
            <p className="text-sm">Date of Issue</p>
            <p>{reservation.issueDate}</p>
          </div>
          <div>
            <p className="text-sm">Booking Code</p>
            <p className="font-bold">{reservation.bookingCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
}