export default async function handler(req, res) {
    const { method, body } = req;
    
    try {
      const hitpayResponse = await fetch('https://api.sandbox.hit-pay.com/v1/payment-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-BUSINESS-API-KEY': process.env.VITE_HITPAY_API_KEY,
        },
        body: JSON.stringify(body)
      });
      
      const data = await hitpayResponse.json();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }