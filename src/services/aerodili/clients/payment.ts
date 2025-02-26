import { createSoapClient, handleSoapError, createSoapHeaders } from '../utils/soap';
import { SOAP_ACTIONS } from '../config';
import type { ApiResponse } from '../types/common';
import type {
  PaymentRequest,
  PaymentResponse,
  PaymentVerificationRequest,
  PaymentVerificationResponse,
} from '../types/payment';

export class PaymentClient {
  private static async execute<T>(action: string, params: any): Promise<ApiResponse<T>> {
    try {
      const client = await createSoapClient();
      const headers = createSoapHeaders(action);
      
      const [result] = await client[action](params, { headers });
      
      return {
        success: true,
        data: result as T
      };
    } catch (error) {
      return {
        success: false,
        error: handleSoapError(error)
      };
    }
  }

  static createPayment(params: PaymentRequest): Promise<ApiResponse<PaymentResponse>> {
    return this.execute(SOAP_ACTIONS.PAYMENT.CREATE, params);
  }

  static verifyPayment(params: PaymentVerificationRequest): Promise<ApiResponse<PaymentVerificationResponse>> {
    return this.execute(SOAP_ACTIONS.PAYMENT.VERIFY, params);
  }
}