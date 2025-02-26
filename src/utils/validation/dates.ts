import { isAfter, isBefore, startOfDay } from 'date-fns';

interface DateErrors {
  departureDate?: string;
  returnDate?: string;
}

export function validateDates(
  departureDate: string,
  returnDate: string | undefined,
  tripType: 'one-way' | 'return'
): DateErrors | null {
  const errors: DateErrors = {};
  const today = startOfDay(new Date());
  
  // Validate departure date
  if (!departureDate) {
    errors.departureDate = 'Departure date is required';
  } else {
    const departureDateObj = new Date(departureDate);
    if (isBefore(departureDateObj, today)) {
      errors.departureDate = 'Departure date cannot be in the past';
    }
  }

  // Validate return date for return trips
  if (tripType === 'return') {
    if (!returnDate) {
      errors.returnDate = 'Return date is required for return trips';
    } else if (departureDate) {
      const departureDateObj = new Date(departureDate);
      const returnDateObj = new Date(returnDate);
      
      if (isBefore(returnDateObj, departureDateObj)) {
        errors.returnDate = 'Return date must be after departure date';
      }
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}