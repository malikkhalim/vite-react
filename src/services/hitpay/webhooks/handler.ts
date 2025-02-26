import { HITPAY_CONFIG } from '../../../config/hitpay';
import { createHmac } from 'crypto';
import type { WebhookEvent } from '../types';

export class WebhookHandler {
  static validateSignature(payload: WebhookEvent, signature: string): boolean {
    try {
      const hmac = createHmac('sha256', HITPAY_CONFIG.SALT);
      hmac.update(JSON.stringify(payload));
      const expectedSignature = hmac.digest('hex');
      return expectedSignature === signature;
    } catch (error) {
      console.error('Signature validation failed:', error);
      return false;
    }
  }

  static async handleWebhook(event: WebhookEvent): Promise<void> {
    console.log('Processing webhook:', event);

    switch (event.status) {
      case 'completed':
        await this.handlePaymentSuccess(event);
        break;
      case 'failed':
        await this.handlePaymentFailure(event);
        break;
      case 'pending':
        console.log('Payment pending:', event.payment_id);
        break;
      default:
        console.log(`Unhandled payment status: ${event.status}`);
    }
  }

  private static async handlePaymentSuccess(event: WebhookEvent): Promise<void> {
    console.log('Payment successful:', {
      paymentId: event.payment_id,
      amount: event.amount,
      reference: event.reference_number
    });

    // Here you would typically:
    // 1. Update order status in your database
    // 2. Send confirmation email
    // 3. Update inventory if needed
    // 4. Trigger any other business logic
  }

  private static async handlePaymentFailure(event: WebhookEvent): Promise<void> {
    console.log('Payment failed:', {
      paymentId: event.payment_id,
      reference: event.reference_number
    });

    // Here you would typically:
    // 1. Update order status
    // 2. Send failure notification
    // 3. Trigger any retry logic if applicable
  }
}