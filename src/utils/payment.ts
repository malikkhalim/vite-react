export function generatePaymentReference(): string {
  return `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
}

export function formatCardNumber(value: string): string {
  return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
}

export function formatExpiryDate(value: string): string {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
}

export function validateCardNumber(cardNumber: string): boolean {
  const cleaned = cardNumber.replace(/\s/g, '');
  return /^\d{16}$/.test(cleaned);
}

export function validateExpiryDate(expiry: string): boolean {
  const [month, year] = expiry.split('/').map(Number);
  if (!month || !year) return false;
  
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  return (
    month >= 1 && 
    month <= 12 && 
    year >= currentYear &&
    (year > currentYear || month >= currentMonth)
  );
}

export function validateCVV(cvv: string): boolean {
  return /^\d{3,4}$/.test(cvv);
}