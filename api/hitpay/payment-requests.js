export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Parse JSON body
    const body = await parseBody(request);
    
    // Get API key
    const apiKey = request.headers['x-business-api-key'] || body.apiKey;
    if (!apiKey) {
      return response.status(400).json({ error: 'API key is required' });
    }
    
    // Remove apiKey from body if it was included there
    const { apiKey: _, ...payloadData } = body;
    
    // Forward the request to HitPay API
    const hitpayResponse = await fetch('https://api.sandbox.hit-pay.com/v1/payment-requests', {
      method: 'POST',
      headers: {
        'X-BUSINESS-API-KEY': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payloadData)
    });
    
    // Get response as text first to check if it's valid JSON
    const textResponse = await hitpayResponse.text();
    let data;
    
    try {
      // Try to parse as JSON
      data = JSON.parse(textResponse);
    } catch (e) {
      // If not valid JSON, return the text response with error status
      console.error('Invalid JSON response from HitPay:', textResponse);
      return response.status(500).json({ 
        error: 'Invalid response from payment service',
        details: textResponse.substring(0, 200) // Limit length for security
      });
    }
    
    // Return the HitPay response with the appropriate status code
    return response.status(hitpayResponse.status).json(data);
  } catch (error) {
    console.error('HitPay API proxy error:', error);
    return response.status(500).json({ 
      error: 'Failed to process payment request',
      details: error.message
    });
  }
}

// Helper function to parse request body
async function parseBody(request) {
  if (request.body) {
    return request.body;
  }
  
  return new Promise((resolve) => {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    });
    request.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch (e) {
        resolve({});
      }
    });
  });
}