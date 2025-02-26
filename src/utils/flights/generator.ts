import { addDays } from 'date-fns';
import { routes } from '../../data/flights/routes';
import { schedules } from '../../data/flights/schedules';
import { aircraft } from '../../data/flights/aircraft';
import { services } from '../../data/flights/services';
import { Flight } from '../../types/flight';
import { parseFlightTime, addFlightDuration, getWeekDay } from './dates';

export function generateFlights(startDate: string, days: number = 7): Flight[] {
  const flights: Flight[] = [];
  const currentDate = new Date(startDate);
  const endDate = addDays(currentDate, days);

  while (currentDate < endDate) {
    const dayOfWeek = getWeekDay(currentDate);
    
    schedules.forEach(schedule => {
      if (schedule.frequency.includes(dayOfWeek)) {
        const route = routes.find(r => 
          `${r.from}-${r.to}` === schedule.routeId
        );
        
        if (route) {
          const departureTime = parseFlightTime(schedule.departureTime, currentDate);
          const arrivalTime = addFlightDuration(departureTime, route.duration);

          const isInternational = route.from !== route.to.substring(0, 2);
          const serviceType = isInternational ? 'international' : 'domestic';
          const planeType = route.distance > 1000 ? '738' : 'AT7';
          const plane = aircraft.find(a => a.code === planeType)!;

          flights.push({
            id: schedule.flightNumber,
            from: route.from,
            to: route.to,
            departureDate: departureTime.toISOString(),
            arrivalDate: arrivalTime.toISOString(),
            duration: route.duration,
            aircraft: plane.type,
            price: route.basePrice,
            businessPrice: route.basePrice * route.businessMultiplier,
            seatsAvailable: Math.floor(Math.random() * plane.capacity.economy),
            businessSeatsAvailable: plane.capacity.business 
              ? Math.floor(Math.random() * plane.capacity.business)
              : 0,
            baggage: plane.baggage,
            services: services[serviceType]
          });
        }
      }
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return flights;
}