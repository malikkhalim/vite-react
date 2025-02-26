export const validateFlightSearch = (from: string, to: string): string | null => {
  if (from === to) {
    return "Origin and destination cannot be the same";
  }
  return null;
};

export const validatePassenger = (passenger: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passport: string;
}): string[] => {
  const errors: string[] = [];
  
  if (!/^[A-Za-z\s]{2,}$/.test(passenger.firstName)) {
    errors.push("First name must contain only letters and be at least 2 characters long");
  }
  
  if (!/^[A-Za-z\s]{2,}$/.test(passenger.lastName)) {
    errors.push("Last name must contain only letters and be at least 2 characters long");
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(passenger.email)) {
    errors.push("Invalid email format");
  }
  
  if (!/^\+?[\d\s-]{8,}$/.test(passenger.phone)) {
    errors.push("Invalid phone number format");
  }
  
  if (!/^[A-Z0-9]{6,}$/.test(passenger.passport.toUpperCase())) {
    errors.push("Invalid passport number format");
  }
  
  return errors;
};