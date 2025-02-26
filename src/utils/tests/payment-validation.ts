import { PaymentService } from '../../services/hitpay/payment.service';

export async function validatePaymentFlow(paymentId: string) {
  console.log(`\n3. Validating Payment Status for ID: ${paymentId}`);
  
  try {
    const status = await PaymentService.getPaymentStatus(paymentId);
    console.log('Payment Status:', status.status);
    
    if (status.status === 'completed') {
      console.log('✅ Payment completed successfully');
    } else if (status.status === 'pending') {
      console.log('⏳ Payment is still pending');
    } else {
      console.log('❌ Payment failed or cancelled');
    }
    
    return status;
  } catch (error) {
    console.error('❌ Payment validation failed:', error);
    throw error;
  }
}