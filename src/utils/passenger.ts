import { PassengerCount } from '../types/flight';
import { PassengerData } from '../types/passenger';

export function initializePassengers(passengerCount: PassengerCount): PassengerData[] {
  const passengers: PassengerData[] = [];

  // Add adults
  for (let i = 0; i < passengerCount.adult; i++) {
    passengers.push({
      type: 'adult',
      salutation: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      passportNumber: '',
      passportExpiry: '',
    });
  }

  // Add children
  for (let i = 0; i < passengerCount.child; i++) {
    passengers.push({
      type: 'child',
      salutation: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      passportNumber: '',
      passportExpiry: '',
    });
  }

  // Add infants
  for (let i = 0; i < passengerCount.infant; i++) {
    passengers.push({
      type: 'infant',
      salutation: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      passportNumber: '',
      passportExpiry: '',
    });
  }

  return passengers;
}