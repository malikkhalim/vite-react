import React from 'react';
import { Ticket, Clock, Info } from 'lucide-react';

export function CheckInInfo() {
  return (
    <div className="grid grid-cols-3 gap-8 my-8 text-center text-sm text-gray-600">
      <div className="flex flex-col items-center gap-2">
        <Ticket className="h-6 w-6 text-gray-400" />
        <p>Present e-ticket and valid identification at check-in</p>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <Clock className="h-6 w-6 text-gray-400" />
        <p>Check-in at least 90 minutes before departure</p>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <Info className="h-6 w-6 text-gray-400" />
        <p>All times shown are in local airport time</p>
      </div>
    </div>
  );
}