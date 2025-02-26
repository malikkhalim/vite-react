import { CARGO_SCHEDULES } from '../../constants/cargo/schedules';
import { isBefore, startOfDay } from 'date-fns';

export function getNextAvailableDate(from: string, to: string): Date | null {
  const routeKey = `${from}-${to}` as keyof typeof CARGO_SCHEDULES;
  const schedule = CARGO_SCHEDULES[routeKey];
  
  if (!schedule) return null;

  const today = startOfDay(new Date());
  
  if (schedule.frequency === 'daily') {
    return today;
  }

  const current = new Date(today);
  
  // Find next occurrence of the scheduled day
  while (current.getDay() !== schedule.day) {
    current.setDate(current.getDate() + 1);
  }

  // If today is the scheduled day but it's already past, move to next week
  if (today.getDay() === schedule.day && isBefore(today, new Date())) {
    current.setDate(current.getDate() + 7);
  }

  return current;
}

export function isValidCargoDate(date: string, from: string, to: string): boolean {
  const routeKey = `${from}-${to}` as keyof typeof CARGO_SCHEDULES;
  const schedule = CARGO_SCHEDULES[routeKey];
  
  if (!schedule) return false;

  const selectedDate = new Date(date);
  const today = startOfDay(new Date());

  // Check if date is not in the past
  if (isBefore(selectedDate, today)) {
    return false;
  }
  
  // For daily routes, any future date is valid
  if (schedule.frequency === 'daily') {
    return true;
  }

  // For weekly routes, check the day of week
  return selectedDate.getDay() === schedule.day;
}

export function getScheduleDescription(from: string, to: string): string {
  const routeKey = `${from}-${to}` as keyof typeof CARGO_SCHEDULES;
  const schedule = CARGO_SCHEDULES[routeKey];

  if (!schedule) return '';

  if (schedule.frequency === 'daily') {
    return 'Available daily';
  }

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return `Available every ${days[schedule.day]}`;
}