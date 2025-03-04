export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
      // Get API key and body data
      const apiKey = req.headers['x-business-api-key'] || req.body.apiKey;
      if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
      }
      
      // Remove apiKey from body if it was included there
      const { apiKey: _, ...payloadData } = req.body;
      
      // Log the request (helpful for debugging)
      console.log('Proxying HitPay request:', {
        url: 'https://api.sandbox.hit-pay.com/v1/payment-requests',
        method: 'POST',
        body: JSON.stringify(payloadData)
      });
      
      // Forward the request to HitPay API
      const response = await fetch('https://api.sandbox.hit-pay.com/v1/payment-requests', {
        method: 'POST',
        headers: {
          'X-BUSINESS-API-KEY': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payloadData)
      });
      
      // Get response as text first to check if it's valid JSON
      const textResponse = await response.text();
      let data;
      
      try {
        // Try to parse as JSON
        data = JSON.parse(textResponse);
      } catch (e) {
        // If not valid JSON, return the text response with error status
        console.error('Invalid JSON response from HitPay:', textResponse);
        return res.status(500).json({ 
          error: 'Invalid response from payment service',
          details: textResponse.substring(0, 200) // Limit length for security
        });
      }
      
      // Return the HitPay response with the appropriate status code
      return res.status(response.status).json(data);
    } catch (error) {
      console.error('HitPay API proxy error:', error);
      return res.status(500).json({ 
        error: 'Failed to process payment request',
        details: error.message
      });
    }
  }