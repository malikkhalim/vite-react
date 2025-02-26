export const CARGO_SCHEDULE = {
  'SIN-DIL': {
    day: 0, // Sunday
    time: '10:00'
  },
  'DIL-SIN': {
    day: 6, // Saturday
    time: '14:00'
  }
} as const;

export function getNextAvailableDate(from: string, to: string): Date | null {
  const routeKey = `${from}-${to}` as keyof typeof CARGO_SCHEDULE;
  const schedule = CARGO_SCHEDULE[routeKey];
  
  if (!schedule) return null;

  const today = new Date();
  const current = new Date(today);
  
  // Find next occurrence of the scheduled day
  while (current.getDay() !== schedule.day) {
    current.setDate(current.getDate() + 1);
  }

  // If today is the scheduled day but past the scheduled time, move to next week
  if (today.getDay() === schedule.day) {
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const scheduleTime = new Date(today);
    scheduleTime.setHours(hours, minutes, 0, 0);

    if (today > scheduleTime) {
      current.setDate(current.getDate() + 7);
    }
  }

  return current;
}

export function isValidCargoDate(date: string, from: string, to: string): boolean {
  const routeKey = `${from}-${to}` as keyof typeof CARGO_SCHEDULE;
  const schedule = CARGO_SCHEDULE[routeKey];
  
  if (!schedule) return false;

  const selectedDate = new Date(date);
  return selectedDate.getDay() === schedule.day;
}