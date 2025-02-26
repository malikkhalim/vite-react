import { Flight, BookingFormData } from '../../types/flight';
import { generateFlights } from './generator';

function getTotalPassengers(passengers: { adult: number; child: number; infant: number }) {
  // Infants don't need their own seat
  return passengers.adult + passengers.child;
}

export function searchFlights(searchData: Omit<BookingFormData, 'returnDate' | 'tripType'> & { date: string }): Flight[] {
  if (!searchData?.date) return [];

  // Generate sample flights for the selected date and surrounding dates
  const searchDate = new Date(searchData.date);
  const startDate = new Date(searchDate);
  startDate.setDate(startDate.getDate() - 3); // Include 3 days before
  
  const allFlights = generateFlights(startDate.toISOString(), 7); // 7 days total
  
  // Filter flights based on search criteria
  return allFlights.filter(flight => {
    const departureDate = new Date(flight.departureDate);
    const searchDateStr = searchData.date.split('T')[0];
    const departureDateStr = departureDate.toISOString().split('T')[0];
    
    const dateMatches = departureDateStr === searchDateStr;
    const routeMatches = flight.from === searchData.from && flight.to === searchData.to;
    
    const totalPassengers = getTotalPassengers(searchData.passengers);
    const hasAvailableSeats = searchData.class === 'business'
      ? flight.businessSeatsAvailable >= totalPassengers
      : flight.seatsAvailable >= totalPassengers;

    return dateMatches && routeMatches && hasAvailableSeats;
  });
}