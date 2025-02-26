import { format, parse, addDays } from 'date-fns';

export function formatFlightDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function parseFlightTime(time: string, date: Date): Date {
  return parse(time, 'HH:mm', date);
}

export function addFlightDuration(date: Date, minutes: number): Date {
  const days = Math.floor(minutes / 1440);
  const remainingMinutes = minutes % 1440;
  let result = addDays(date, days);
  result.setMinutes(date.getMinutes() + remainingMinutes);
  return result;
}

export function getWeekDay(date: Date): string {
  return format(date, 'EEE').toLowerCase();
}