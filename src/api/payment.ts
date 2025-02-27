import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const HITPAY_API_KEY = process.env.VITE_HITPAY_API_KEY;
  
  if (!HITPAY_API_KEY) {
    return response.status(500).json({ error: 'HitPay API key is not configured' });
  }

  try {
    console.log('Payment request received:', request.body);
    
    const hitpayResponse = await fetch('https://api.sandbox.hit-pay.com/v1/payment-requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-BUSINESS-API-KEY': HITPAY_API_KEY,
      },
      body: JSON.stringify(request.body)
    });

    // Check if the response was successful
    if (!hitpayResponse.ok) {
      const errorText = await hitpayResponse.text();
      console.error('HitPay API error:', errorText);
      return response.status(hitpayResponse.status).json({ 
        error: 'Payment request failed', 
        details: errorText 
      });
    }

    const data = await hitpayResponse.json();
    console.log('HitPay API response:', data);
    return response.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    return response.status(500).json({ 
      error: 'Internal server error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}