import React from 'react';

export function CompanyInfo() {
  return (
    <div className="flex justify-between items-start text-sm border-t pt-6">
      <div>
        <p className="font-bold">AERO DILI TRANSPORT SERVICE, S.A</p>
        <p>Timor Plaza CBD 3 unit 103,</p>
        <p>Dili, Timor-Leste</p>
      </div>
      
      <div className="text-right">
        <p>Call Centre : +67078888444</p>
        <p>Email : contact@aerodili.com</p>
        <p>Website : aerodili.com</p>
      </div>
    </div>
  );
}