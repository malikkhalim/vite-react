import { testHitPayIntegration } from '../../utils/tests/hitpay.test';
import { validatePaymentFlow } from '../../utils/tests/payment-validation';

export async function runHitPayTests() {
  try {
    console.log('🚀 Starting HitPay Integration Tests...\n');
    
    // Test the payment creation
    const paymentResponse = await testHitPayIntegration();
    
    if (paymentResponse?.payment_id) {
      // Test the payment status validation
      await validatePaymentFlow(paymentResponse.payment_id);
    }
    
    console.log('\n✨ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
    throw error;
  }
}

// Run the tests
runHitPayTests().catch(console.error);