import { format, addDays as dateFnsAddDays, parseISO } from 'date-fns';

export function formatTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'h:mm a');
}

export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatDateTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'MMM d, yyyy h:mm a');
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

export function addDays(date: Date, days: number): Date {
  return dateFnsAddDays(date, days);
}

export function toISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getCurrentDate(): string {
  return toISODateString(new Date());
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}