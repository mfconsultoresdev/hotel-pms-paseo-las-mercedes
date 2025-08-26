import { 
  PaymentRequest, 
  PaymentResponse, 
  RefundRequest, 
  RefundResponse,
  PaymentGatewayConfig 
} from './types';

export class MercadoPagoGateway {
  private config: PaymentGatewayConfig;
  private baseUrl: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
    this.baseUrl = config.isTestMode 
      ? 'https://api.mercadopago.com/sandbox' 
      : 'https://api.mercadopago.com';
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.baseUrl}/oauth/token`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.config.apiKey}:${this.config.secretKey}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        throw new Error(`MercadoPago OAuth failed: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

      return this.accessToken || '';
    } catch (error) {
      console.error('MercadoPago access token retrieval failed:', error);
      throw new Error('Failed to get MercadoPago access token');
    }
  }

  async createPaymentIntent(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const preference = {
        items: [{
          title: request.description,
          quantity: 1,
          unit_price: request.amount,
          currency_id: this.mapCurrencyToMercadoPago(request.currency),
        }],
        external_reference: request.reservationId,
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/payments/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/payments/failure`,
          pending: `${process.env.NEXT_PUBLIC_APP_URL}/payments/pending`,
        },
        auto_return: 'approved',
        expires: true,
        expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        statement_descriptor: 'Hotel PMS',
        binary_mode: true,
      };

      const response = await fetch(`${this.baseUrl}/checkout/preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preference),
      });

      if (!response.ok) {
        throw new Error(`MercadoPago preference creation failed: ${response.statusText}`);
      }

      const preferenceData = await response.json();

      return {
        success: true,
        transactionId: preferenceData.id,
        gatewayTransactionId: preferenceData.id,
        status: 'pending',
        message: 'MercadoPago preference created successfully',
        data: {
          preferenceId: preferenceData.id,
          initPoint: preferenceData.init_point,
          sandboxInitPoint: preferenceData.sandbox_init_point,
          preference: preferenceData,
        },
      };
    } catch (error) {
      console.error('MercadoPago payment intent creation failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to create MercadoPago preference',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async confirmPayment(paymentId: string): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`MercadoPago payment retrieval failed: ${response.statusText}`);
      }

      const payment = await response.json();

      return {
        success: payment.status === 'approved',
        transactionId: payment.id.toString(),
        gatewayTransactionId: payment.id.toString(),
        status: this.mapMercadoPagoStatus(payment.status),
        message: `Payment ${payment.status}`,
        data: { payment },
      };
    } catch (error) {
      console.error('MercadoPago payment confirmation failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to confirm MercadoPago payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const refundData = {
        amount: request.amount || 0,
        reason: request.reason || 'Refund processed',
        external_reference: `REF-${Date.now()}`,
      };

      const response = await fetch(`${this.baseUrl}/v1/payments/${request.transactionId}/refunds`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refundData),
      });

      if (!response.ok) {
        throw new Error(`MercadoPago refund failed: ${response.statusText}`);
      }

      const refund = await response.json();

      return {
        success: true,
        refundId: refund.id.toString(),
        status: 'completed',
        message: 'MercadoPago refund processed successfully',
      };
    } catch (error) {
      console.error('MercadoPago refund failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to process MercadoPago refund',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`MercadoPago payment retrieval failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('MercadoPago payment retrieval failed:', error);
      return null;
    }
  }

  async cancelPayment(paymentId: string): Promise<PaymentResponse> {
    try {
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'cancelled',
        }),
      });

      if (!response.ok) {
        throw new Error(`MercadoPago payment cancellation failed: ${response.statusText}`);
      }

      const payment = await response.json();

      return {
        success: true,
        transactionId: payment.id.toString(),
        gatewayTransactionId: payment.id.toString(),
        status: 'canceled',
        message: 'MercadoPago payment cancelled successfully',
        data: { payment },
      };
    } catch (error) {
      console.error('MercadoPago payment cancellation failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to cancel MercadoPago payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<any> {
    try {
      // MercadoPago webhook verification is done via the x-signature header
      // and the x-request-id header for additional security
      const webhookData = JSON.parse(payload);
      
      // Verify the webhook data structure
      if (!webhookData.data || !webhookData.type) {
        throw new Error('Invalid webhook data structure');
      }

      // Additional verification can be done by checking the payment status
      // against the MercadoPago API
      return webhookData;
    } catch (error) {
      console.error('MercadoPago webhook verification failed:', error);
      return null;
    }
  }

  private mapCurrencyToMercadoPago(currency: string): string {
    const currencyMap: Record<string, string> = {
      'USD': 'USD',
      'EUR': 'EUR',
      'MXN': 'MXN',
      'ARS': 'ARS',
      'CLP': 'CLP',
      'COP': 'COP',
      'PEN': 'PEN',
      'UYU': 'UYU',
    };
    return currencyMap[currency.toUpperCase()] || 'USD';
  }

  private mapMercadoPagoStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'pending',
      'approved': 'succeeded',
      'authorized': 'processing',
      'in_process': 'processing',
      'in_mediation': 'processing',
      'rejected': 'failed',
      'cancelled': 'canceled',
      'refunded': 'refunded',
      'charged_back': 'failed',
    };
    return statusMap[status] || status;
  }

  getSupportedCurrencies(): string[] {
    return ['USD', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU'];
  }

  getSupportedPaymentMethods(): string[] {
    return ['credit_card', 'debit_card', 'bank_transfer', 'digital_wallet', 'cash'];
  }

  calculateFees(amount: number): number {
    const percentageFee = this.config.fees.percentage;
    const fixedFee = this.config.fees.fixed;
    return (amount * percentageFee) + fixedFee;
  }
}
