import { WebhookHandler } from './handler';
import type { WebhookEvent } from '../types';

export async function handleWebhookRequest(req: Request): Promise<Response> {
  try {
    const signature = req.headers.get('X-HITPAY-SIGNATURE');
    if (!signature) {
      return new Response('Missing signature', { status: 401 });
    }

    const payload = await req.json() as WebhookEvent;
    
    // Validate webhook signature
    if (!WebhookHandler.validateSignature(payload, signature)) {
      return new Response('Invalid signature', { status: 401 });
    }

    // Process the webhook
    await WebhookHandler.handleWebhook(payload);

    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}