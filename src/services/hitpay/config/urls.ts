const BASE_URL = {
  PRODUCTION: 'https://api.hit-pay.com/v1',
  SANDBOX: 'https://api.sandbox.hit-pay.com/v1'
};

export const getApiUrl = (isDevelopment: boolean = process.env.NODE_ENV === 'development'): string => {
  return isDevelopment ? BASE_URL.SANDBOX : BASE_URL.PRODUCTION;
};

export const getRedirectUrls = (origin: string) => ({
  success: `${origin}/payment/success`,
  cancel: `${origin}/payment/cancel`,
  webhook: `${origin}/api/hitpay/webhook`
});