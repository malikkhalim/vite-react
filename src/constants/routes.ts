// Update the cargo routes
export const CARGO_ROUTES = {
  'SIN': ['DIL'],
  'DIL': ['SIN', 'DPS']
} as const;

export const validateCargoRoute = (from: string, to: string): string | null => {
  if (!from || !to) {
    return "Please select both origin and destination";
  }

  if (from === to) {
    return "Origin and destination cannot be the same";
  }

  // Check if the route is valid
  const availableDestinations = CARGO_ROUTES[from as keyof typeof CARGO_ROUTES];
  if (!availableDestinations?.includes(to as any)) {
    return "Invalid route selected";
  }

  return null;
};

export const getAvailableCargoDestinations = (from: string) => {
  return CARGO_ROUTES[from as keyof typeof CARGO_ROUTES] || [];
};