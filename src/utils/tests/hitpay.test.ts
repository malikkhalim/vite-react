import { PaymentService } from '../../services/hitpay/payment.service';
import { HITPAY_CONFIG } from '../../config/hitpay';

export async function testHitPayIntegration() {
  console.log('🔍 Testing HitPay Integration...');

  // Test 1: Configuration Check
  console.log('\n1. Checking HitPay Configuration...');
  if (!HITPAY_CONFIG.API_KEY) {
    throw new Error('HitPay API Key is missing');
  }
  if (!HITPAY_CONFIG.SALT) {
    throw new Error('HitPay Salt is missing');
  }
  console.log('✅ Configuration is valid');

  // Test 2: Create Payment Request
  console.log('\n2. Testing Payment Creation...');
  try {
    const testPayment = {
      amount: 10.00,
      currency: 'USD',
      email: 'test@example.com',
      name: 'Test User',
      phone: '+1234567890',
      reference_number: `TEST-${Date.now()}`
    };

    const response = await PaymentService.createPayment(testPayment);
    console.log('✅ Payment creation successful');
    console.log('Payment URL:', response.url);
    return response;
  } catch (error) {
    console.error('❌ Payment creation failed:', error);
    throw error;
  }
}