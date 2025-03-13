export default async function handler(req, res) {
    // Verify webhook signature
    const signature = req.headers['x-hit-pay-signature'];
    if (!verifySignature(req.body, signature, process.env.HITPAY_SALT)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }
    
    const { event, data } = req.body;
    if (event === 'payment.completed') {
      // Payment successful, ensure receipt was sent
      const { reference_number, email } = data;
      
      // Optionally send a custom receipt/invoice email
      await sendCustomInvoiceEmail(email, data);
      
      // Update order status in your database
      await updateOrderStatus(reference_number, 'paid');
    }
    
    return res.status(200).json({ received: true });
  }