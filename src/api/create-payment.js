export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const HITPAY_API_KEY = process.env.VITE_HITPAY_API_KEY;
    
    if (!HITPAY_API_KEY) {
      return res.status(500).json({ error: 'HitPay API key is not configured' });
    }
  
    try {
      const response = await fetch('https://api.sandbox.hit-pay.com/v1/payment-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BUSINESS-API-KEY': HITPAY_API_KEY,
        },
        body: JSON.stringify(req.body)
      });
  
      // Check if the response was successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error('HitPay API error:', errorText);
        return res.status(response.status).json({ 
          error: 'Payment request failed', 
          details: errorText 
        });
      }
  
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }