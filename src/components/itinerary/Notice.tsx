import React from 'react';

export function Notice() {
  return (
    <div className="mb-6 space-y-4">
      <p className="font-bold">NOTICE:</p>
      <p className="italic text-gray-600">
        "Carriage and other services provided by the carrier are subject to conditions of carriage, which 
        are hereby incorporated by reference. These conditions may be obtained from the issuing carrier."
      </p>
      <p>Tiket anda tersimpan di sistem reservasi dan ini adalah data tiket elektronik anda.</p>
      <p className="italic text-gray-600">
        Your airline ticket is electronically stored in computer reservation system and is your record of 
        your electronic ticket.
      </p>
    </div>
  );
}