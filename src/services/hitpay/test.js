import { PaymentAPI } from './api/payment.js';

async function testHitPayIntegration() {
  console.log('🚀 Starting HitPay Integration Tests...\n');

  try {
    // Test 1: Create Payment Request
    console.log('1. Testing Payment Creation...');
    const testPayment = {
      amount: 10.00,
      currency: 'USD',
      email: 'test@example.com',
      name: 'Test User',
      phone: '+1234567890',
      reference_number: `TEST-${Date.now()}`
    };

    const response = await PaymentAPI.createPayment(testPayment);
    console.log('✅ Payment creation successful');
    console.log('Payment URL:', response.url);
    console.log('Payment ID:', response.payment_id);

    // Test 2: Check Payment Status
    if (response.payment_id) {
      console.log('\n2. Testing Payment Status Check...');
      const status = await PaymentAPI.getPaymentStatus(response.payment_id);
      console.log('✅ Payment status retrieved successfully');
      console.log('Status:', status.status);
    }

    console.log('\n✨ All tests completed successfully!');
    return true;
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    return false;
  }
}

// Run the tests
testHitPayIntegration().then(success => {
  process.exit(success ? 0 : 1);
});