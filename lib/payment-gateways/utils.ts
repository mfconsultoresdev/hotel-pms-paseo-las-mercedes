import { PaymentGatewayConfig, PaymentRequest, PaymentResponse } from './types';
import { StripeGateway } from './stripe';
import { PayPalGateway } from './paypal';
import { MercadoPagoGateway } from './mercadopago';

export class PaymentGatewayManager {
  private gateways: Map<string, any> = new Map();
  private configs: Map<string, PaymentGatewayConfig> = new Map();

  constructor() {
    this.initializeGateways();
  }

  private initializeGateways(): void {
    // Initialize with default configurations
    const defaultConfigs: PaymentGatewayConfig[] = [
      {
        provider: 'stripe',
        isActive: false,
        isTestMode: true,
        apiKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
        secretKey: process.env.STRIPE_SECRET_KEY || '',
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
        supportedCurrencies: ['usd', 'eur', 'mxn'],
        supportedPaymentMethods: ['card', 'bank_transfer'],
        fees: { percentage: 0.029, fixed: 0.30 },
        config: {},
      },
      {
        provider: 'paypal',
        isActive: false,
        isTestMode: true,
        apiKey: process.env.PAYPAL_CLIENT_ID || '',
        secretKey: process.env.PAYPAL_CLIENT_SECRET || '',
        webhookSecret: process.env.PAYPAL_WEBHOOK_ID || '',
        supportedCurrencies: ['USD', 'EUR', 'MXN'],
        supportedPaymentMethods: ['paypal', 'card'],
        fees: { percentage: 0.029, fixed: 0.30 },
        config: {},
      },
      {
        provider: 'mercadopago',
        isActive: false,
        isTestMode: true,
        apiKey: process.env.MERCADOPAGO_PUBLIC_KEY || '',
        secretKey: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
        webhookSecret: process.env.MERCADOPAGO_WEBHOOK_SECRET || '',
        supportedCurrencies: ['USD', 'MXN', 'ARS'],
        supportedPaymentMethods: ['credit_card', 'debit_card'],
        fees: { percentage: 0.039, fixed: 0.50 },
        config: {},
      },
    ];

    defaultConfigs.forEach(config => {
      this.addGateway(config);
    });
  }

  addGateway(config: PaymentGatewayConfig): void {
    if (!config.isActive) return;

    let gateway: any;

    switch (config.provider) {
      case 'stripe':
        gateway = new StripeGateway(config);
        break;
      case 'paypal':
        gateway = new PayPalGateway(config);
        break;
      case 'mercadopago':
        gateway = new MercadoPagoGateway(config);
        break;
      default:
        console.warn(`Unsupported payment provider: ${config.provider}`);
        return;
    }

    this.gateways.set(config.provider, gateway);
    this.configs.set(config.provider, config);
    console.log(`Payment gateway ${config.provider} initialized`);
  }

  removeGateway(provider: string): void {
    this.gateways.delete(provider);
    this.configs.delete(provider);
    console.log(`Payment gateway ${provider} removed`);
  }

  getGateway(provider: string): any {
    return this.gateways.get(provider);
  }

  getActiveGateways(): string[] {
    return Array.from(this.gateways.keys());
  }

  getGatewayConfig(provider: string): PaymentGatewayConfig | undefined {
    return this.configs.get(provider);
  }

  async processPayment(provider: string, request: PaymentRequest): Promise<PaymentResponse> {
    const gateway = this.getGateway(provider);
    if (!gateway) {
      return {
        success: false,
        status: 'failed',
        message: `Payment gateway ${provider} not available`,
        error: 'Gateway not found',
      };
    }

    try {
      return await gateway.createPaymentIntent(request);
    } catch (error) {
      console.error(`Payment processing failed for ${provider}:`, error);
      return {
        success: false,
        status: 'failed',
        message: 'Payment processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async confirmPayment(provider: string, paymentId: string, paymentMethodId?: string): Promise<PaymentResponse> {
    const gateway = this.getGateway(provider);
    if (!gateway) {
      return {
        success: false,
        status: 'failed',
        message: `Payment gateway ${provider} not available`,
        error: 'Gateway not found',
      };
    }

    try {
      if (provider === 'stripe' && paymentMethodId) {
        return await gateway.confirmPayment(paymentId, paymentMethodId);
      } else {
        return await gateway.confirmPayment(paymentId);
      }
    } catch (error) {
      console.error(`Payment confirmation failed for ${provider}:`, error);
      return {
        success: false,
        status: 'failed',
        message: 'Payment confirmation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async processRefund(provider: string, request: any): Promise<any> {
    const gateway = this.getGateway(provider);
    if (!gateway) {
      return {
        success: false,
        status: 'failed',
        message: `Payment gateway ${provider} not available`,
        error: 'Gateway not found',
      };
    }

    try {
      return await gateway.processRefund(request);
    } catch (error) {
      console.error(`Refund processing failed for ${provider}:`, error);
      return {
        success: false,
        status: 'failed',
        message: 'Refund processing failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  getSupportedCurrencies(provider: string): string[] {
    const gateway = this.getGateway(provider);
    if (!gateway) return [];

    try {
      return gateway.getSupportedCurrencies();
    } catch (error) {
      console.error(`Failed to get supported currencies for ${provider}:`, error);
      return [];
    }
  }

  getSupportedPaymentMethods(provider: string): string[] {
    const gateway = this.getGateway(provider);
    if (!gateway) return [];

    try {
      return gateway.getSupportedPaymentMethods();
    } catch (error) {
      console.error(`Failed to get supported payment methods for ${provider}:`, error);
      return [];
    }
  }

  calculateFees(provider: string, amount: number): number {
    const gateway = this.getGateway(provider);
    if (!gateway) return 0;

    try {
      return gateway.calculateFees(amount);
    } catch (error) {
      console.error(`Failed to calculate fees for ${provider}:`, error);
      return 0;
    }
  }

  isGatewayAvailable(provider: string): boolean {
    return this.gateways.has(provider);
  }

  getGatewayStatus(provider: string): { available: boolean; active: boolean; testMode: boolean } {
    const gateway = this.gateways.get(provider);
    const config = this.configs.get(provider);

    return {
      available: !!gateway,
      active: config?.isActive || false,
      testMode: config?.isTestMode || false,
    };
  }

  async testGateway(provider: string): Promise<{ success: boolean; message: string; error?: string }> {
    const gateway = this.getGateway(provider);
    if (!gateway) {
      return {
        success: false,
        message: `Gateway ${provider} not available`,
        error: 'Gateway not found',
      };
    }

    try {
      // Test the gateway with a minimal request
      const testRequest: PaymentRequest = {
        amount: 1.00,
        currency: 'USD',
        customerId: 'test-customer',
        reservationId: 'test-reservation',
        description: 'Gateway test',
      };

      const response = await gateway.createPaymentIntent(testRequest);
      
      if (response.success) {
        return {
          success: true,
          message: `Gateway ${provider} test successful`,
        };
      } else {
        return {
          success: false,
          message: `Gateway ${provider} test failed`,
          error: response.error || 'Unknown error',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Gateway ${provider} test failed`,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Utility functions
export function formatCurrency(amount: number, currency: string): string {
  const formatter = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}

export function validatePaymentRequest(request: PaymentRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!request.amount || request.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }

  if (!request.currency) {
    errors.push('Currency is required');
  }

  if (!request.customerId) {
    errors.push('Customer ID is required');
  }

  if (!request.reservationId) {
    errors.push('Reservation ID is required');
  }

  if (!request.description) {
    errors.push('Description is required');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber || cardNumber.length < 4) return cardNumber;
  return `**** **** **** ${cardNumber.slice(-4)}`;
}

export function validateCardNumber(cardNumber: string): boolean {
  // Luhn algorithm for card validation
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

export function validateExpiryDate(month: number, year: number): boolean {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  if (month < 1 || month > 12) return false;

  return true;
}

export function calculateInstallmentAmount(totalAmount: number, installments: number, interestRate: number = 0): number {
  if (installments <= 1) return totalAmount;
  
  const monthlyInterest = interestRate / 100 / 12;
  const monthlyPayment = (totalAmount * monthlyInterest * Math.pow(1 + monthlyInterest, installments)) / 
                        (Math.pow(1 + monthlyInterest, installments) - 1);
  
  return monthlyPayment;
}

// Export singleton instance
export const paymentGatewayManager = new PaymentGatewayManager();

