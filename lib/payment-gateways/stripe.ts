import Stripe from 'stripe';
import { 
  PaymentRequest, 
  PaymentResponse, 
  RefundRequest, 
  RefundResponse,
  PaymentGatewayConfig 
} from './types';

export class StripeGateway {
  private stripe: Stripe;
  private config: PaymentGatewayConfig;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
    this.stripe = new Stripe(config.secretKey, {
      apiVersion: '2025-07-30.basil',
      typescript: true,
    });
  }

  async createPaymentIntent(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(request.amount * 100), // Stripe uses cents
        currency: request.currency.toLowerCase(),
        customer: request.customerId,
        metadata: {
          reservationId: request.reservationId,
          description: request.description,
          ...request.metadata,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        transactionId: paymentIntent.id,
        gatewayTransactionId: paymentIntent.id,
        status: paymentIntent.status,
        message: 'Payment intent created successfully',
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntent,
        },
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to create payment intent',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId,
      });

      return {
        success: paymentIntent.status === 'succeeded',
        transactionId: paymentIntent.id,
        gatewayTransactionId: paymentIntent.id,
        status: paymentIntent.status,
        message: `Payment ${paymentIntent.status}`,
        data: { paymentIntent },
      };
    } catch (error) {
      console.error('Stripe payment confirmation failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to confirm payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processRefund(request: RefundRequest): Promise<RefundResponse> {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: request.transactionId,
        amount: request.amount ? Math.round(request.amount * 100) : undefined,
        reason: request.reason as any,
        metadata: request.metadata,
      });

      return {
        success: true,
        refundId: refund.id,
        status: refund.status || 'succeeded',
        message: 'Refund processed successfully',
      };
    } catch (error) {
      console.error('Stripe refund failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to process refund',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createCustomer(email: string, name?: string, phone?: string): Promise<string> {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        phone,
      });
      return customer.id;
    } catch (error) {
      console.error('Stripe customer creation failed:', error);
      throw new Error('Failed to create customer');
    }
  }

  async addPaymentMethod(customerId: string, paymentMethodId: string): Promise<boolean> {
    try {
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
      return true;
    } catch (error) {
      console.error('Stripe payment method attachment failed:', error);
      return false;
    }
  }

  async getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods.data;
    } catch (error) {
      console.error('Stripe payment methods retrieval failed:', error);
      return [];
    }
  }

  async createSetupIntent(customerId: string): Promise<string | null> {
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
      });
      return setupIntent.client_secret;
    } catch (error) {
      console.error('Stripe setup intent creation failed:', error);
      return null;
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<Stripe.Event | null> {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.webhookSecret || ''
      );
      return event;
    } catch (error) {
      console.error('Stripe webhook verification failed:', error);
      return null;
    }
  }

  async getTransaction(transactionId: string): Promise<Stripe.PaymentIntent | null> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(transactionId);
      return paymentIntent;
    } catch (error) {
      console.error('Stripe transaction retrieval failed:', error);
      return null;
    }
  }

  async cancelPayment(paymentIntentId: string): Promise<PaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId);

      return {
        success: true,
        transactionId: paymentIntent.id,
        gatewayTransactionId: paymentIntent.id,
        status: paymentIntent.status,
        message: 'Payment cancelled successfully',
        data: { paymentIntent },
      };
    } catch (error) {
      console.error('Stripe payment cancellation failed:', error);
      return {
        success: false,
        status: 'failed',
        message: 'Failed to cancel payment',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  getSupportedCurrencies(): string[] {
    return ['usd', 'eur', 'mxn', 'ars', 'clp', 'cop', 'pen', 'uyu'];
  }

  getSupportedPaymentMethods(): string[] {
    return ['card', 'bank_transfer', 'digital_wallet'];
  }

  calculateFees(amount: number): number {
    const percentageFee = this.config.fees.percentage;
    const fixedFee = this.config.fees.fixed;
    return (amount * percentageFee) + fixedFee;
  }
}
