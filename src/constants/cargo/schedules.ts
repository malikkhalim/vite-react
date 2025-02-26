export const CARGO_SCHEDULES = {
  'SIN-DIL': {
    day: 0, // Sunday
    frequency: 'weekly'
  },
  'DIL-SIN': {
    day: 6, // Saturday
    frequency: 'weekly'
  },
  'DIL-DPS': {
    frequency: 'daily'
  }
} as const;

export type CargoRoute = keyof typeof CARGO_SCHEDULES;