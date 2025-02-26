import React from 'react';

export function TermsAndConditions() {
  return (
    <div className="space-y-4 text-sm text-gray-600">
      <h2 className="text-lg font-bold text-red-600">Terms and Conditions</h2>
      <div className="space-y-2">
        <p>1. All fares and other services provided by the carrier are subject to conditions of carriage, which are incorporated by reference. These conditions may be obtained from the issuing carrier.</p>
        <p>2. Check-in counters close 45 minutes before departure time for domestic flights and 60 minutes for international flights.</p>
        <p>3. Passengers must present valid identification and travel documents at check-in.</p>
        <p>4. The airline reserves the right to refuse carriage if the applicable fare has not been paid or if credit arrangements have not been complied with.</p>
        <p>5. Baggage allowance is subject to the fare rules of your ticket.</p>
      </div>
    </div>
  );
}