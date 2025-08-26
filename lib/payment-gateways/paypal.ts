import { 
  PaymentRequest, 
  PaymentResponse, 
  RefundRequest, 
  RefundResponse,
  PaymentGatewayConfig 
} from './types';

export class PayPalGateway {
  private config: PaymentGatewayConfig;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
    this.baseUrl = config.isTestMode 
      ? 'https://api-m.sandbox.paypal.com' 
      : 'https://api-m.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.secretKey}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error(`PayPal OAuth failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

      return this.accessToken || '';
    } catch (error) {
      console.error('PayPal access token retrieval failed:', error);
      throw new Error('Failed to get PayPal access token');
    }
  }

  async createPaymentIntent(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const paypalOrder = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: request.currency.toUpperCase(),
            value: request.amount.toFixed(2),
          },
          description: request.description,
          custom_id: request.reservationId,
          invoice_id: `INV-${Date.now()}`,
        }],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/cancel`,
          brand_name: 'Hotel Paseo Las Mercedes',
          landing_page: 'LOGIN',
          user_action: 'PAY_NOW',
        },
      };

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(paypalOrder),
      });

      if (!response.ok) {
        throw new Error(`PayPal order creation failed: ${response.statusText}`);
      }

      const order = await response.json();

      return {
        success: true,
        transactionId: order.id,
        gatewayTransactionId: order.id,
        status: order.status,
        message: 'PayPal order created successfully',
        data: {
          orderId: order.id,
          approvalUrl: order.links.find((link: any) => link.rel === 'approve')?.href,
          order,
        },
      };
    } catch (error) {
      console.error('PayPal payment intent creation failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to create PayPal order',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async confirmPayment(orderId: string): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
      });

      if (!response.ok) {
        throw new Error(`PayPal payment capture failed: ${response.statusText}`);
      }

      const capture = await response.json();

      return {
        success: capture.status === 'COMPLETED',
        transactionId: capture.id,
        gatewayTransactionId: capture.id,
        status: capture.status,
        message: `Payment ${capture.status}`,
        data: { capture },
      };
    } catch (error) {
      console.error('PayPal payment confirmation failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to confirm PayPal payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const refundData = {
        amount: {
          currency_code: 'USD', // PayPal refunds in original currency
          value: request.amount?.toFixed(2) || '0.00',
        },
        note_to_payer: request.reason || 'Refund processed',
        invoice_id: `REF-${Date.now()}`,
      };

      const response = await fetch(`${this.baseUrl}/v2/payments/captures/${request.transactionId}/refund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(refundData),
      });

      if (!response.ok) {
        throw new Error(`PayPal refund failed: ${response.statusText}`);
      }

      const refund = await response.json();

      return {
        success: true,
        refundId: refund.id,
        status: refund.status,
        message: 'PayPal refund processed successfully',
      };
    } catch (error) {
      console.error('PayPal refund failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to process PayPal refund',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`PayPal order retrieval failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('PayPal order retrieval failed:', error);
      return null;
    }
  }

  async cancelOrder(orderId: string): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: 'CANCELLED_BY_BUYER',
        }),
      });

      if (!response.ok) {
        throw new Error(`PayPal order cancellation failed: ${response.statusText}`);
      }

      return {
        success: true,
        transactionId: orderId,
        gatewayTransactionId: orderId,
        status: 'canceled',
        message: 'PayPal order cancelled successfully',
      };
    } catch (error) {
      console.error('PayPal order cancellation failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to cancel PayPal order',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth_algo: 'SHA256withRSA',
          cert_url: signature,
          transmission_id: Date.now().toString(),
          transmission_sig: signature,
          transmission_time: new Date().toISOString(),
          webhook_id: this.config.webhookSecret,
          webhook_event: JSON.parse(payload),
        }),
      });

      if (!response.ok) {
        throw new Error(`PayPal webhook verification failed: ${response.statusText}`);
      }

      const verification = await response.json();
      return verification.verification_status === 'SUCCESS' ? JSON.parse(payload) : null;
    } catch (error) {
      console.error('PayPal webhook verification failed:', error);
      return null;
    }
  }

  getSupportedCurrencies(): string[] {
    return ['USD', 'EUR', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU'];
  }

  getSupportedPaymentMethods(): string[] {
    return ['paypal', 'card', 'bank_transfer'];
  }

  calculateFees(amount: number): number {
    const percentageFee = this.config.fees.percentage;
    const fixedFee = this.config.fees.fixed;
    return (amount * percentageFee) + fixedFee;
  }
}
