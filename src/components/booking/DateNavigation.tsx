import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, addDays, toISODateString, isValidDate } from '../../utils/dates';

interface DateNavigationProps {
  currentDate: string;
  onDateChange: (date: string) => void;
  disabled?: boolean;
  onClick?: () => void;
}

export function DateNavigation({ 
  currentDate, 
  onDateChange, 
  disabled = false,
  onClick
}: DateNavigationProps) {
  const handleDateChange = (days: number) => {
    if (!isValidDate(currentDate) || disabled) return;
    
    const date = new Date(currentDate);
    const newDate = addDays(date, days);
    onDateChange(toISODateString(newDate));
  };

  return (
    <div 
      className={`flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-6 ${
        disabled ? 'opacity-50' : ''
      }`}
      onClick={onClick}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDateChange(-1);
        }}
        disabled={disabled}
        className="flex items-center gap-2 text-sky-600 hover:text-sky-700 disabled:text-gray-400 disabled:hover:text-gray-400"
      >
        <ChevronLeft className="h-5 w-5" />
        Previous Day
      </button>
      
      <div className="text-lg font-semibold">
        {isValidDate(currentDate) ? formatDate(currentDate) : 'Invalid Date'}
      </div>
      
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDateChange(1);
        }}
        disabled={disabled}
        className="flex items-center gap-2 text-sky-600 hover:text-sky-700 disabled:text-gray-400 disabled:hover:text-gray-400"
      >
        Next Day
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}