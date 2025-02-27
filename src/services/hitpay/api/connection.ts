import { HITPAY_CONFIG } from '../../../config/hitpay';

export async function checkConnection(): Promise<boolean> {
  if (!HITPAY_CONFIG.API_KEY) {
    return false;
  }

  try {
    const response = await fetch(
      `${HITPAY_CONFIG.SANDBOX ? HITPAY_CONFIG.SANDBOX_API_URL : HITPAY_CONFIG.API_URL}/payment-requests`, 
      {
        method: 'HEAD',
        headers: {
          'X-BUSINESS-API-KEY': HITPAY_CONFIG.API_KEY,
          'Accept': 'application/json',
          'Origin': window.location.origin
        },
        mode: 'cors',
        credentials: 'omit'
      }
    );
    return response.ok;
  } catch {
    return false;
  }
}

export async function getConnectionStatus(): Promise<{
  connected: boolean;
  url: string;
}> {
  const apiUrl = HITPAY_CONFIG.SANDBOX 
    ? HITPAY_CONFIG.SANDBOX_API_URL 
    : HITPAY_CONFIG.API_URL;

  if (!HITPAY_CONFIG.API_KEY) {
    return { 
      connected: false, 
      url: apiUrl,
    };
  }

  const connected = await checkConnection();
  return { connected, url: apiUrl };
}