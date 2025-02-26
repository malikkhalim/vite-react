import { createHmac } from 'crypto';
import { HITPAY_CONFIG } from '../../../config/hitpay';
import type { WebhookPayload } from '../types';

export function verifyWebhookSignature(
  payload: Omit<WebhookPayload, 'hmac'>,
  signature: string
): boolean {
  try {
    // Sort keys alphabetically and concatenate key-value pairs
    const sortedPairs = Object.entries(payload)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}${value}`);

    const concatenatedString = sortedPairs.join('');

    // Generate HMAC using the salt
    const hmac = createHmac('sha256', HITPAY_CONFIG.SALT);
    hmac.update(concatenatedString);
    const calculatedSignature = hmac.digest('hex');

    return calculatedSignature === signature;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}