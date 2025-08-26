export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'digital_wallet' | 'cash';
  provider: 'stripe' | 'paypal' | 'mercadopago' | 'cash';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  paymentMethodId: string;
  customerId: string;
  reservationId: string;
  description: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentTransaction {
  id: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gatewayTransactionId: string;
  gatewayResponse: Record<string, any>;
  fees: number;
  netAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentGatewayConfig {
  provider: 'stripe' | 'paypal' | 'mercadopago';
  isActive: boolean;
  isTestMode: boolean;
  apiKey: string;
  secretKey: string;
  webhookSecret?: string;
  supportedCurrencies: string[];
  supportedPaymentMethods: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
  config: Record<string, any>;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  customerId: string;
  reservationId: string;
  description: string;
  paymentMethodId?: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  gatewayTransactionId?: string;
  status: string;
  message: string;
  error?: string;
  data?: Record<string, any>;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number;
  reason?: string;
  metadata?: Record<string, any>;
}

export interface RefundResponse {
  success: boolean;
  refundId?: string;
  status: string;
  message: string;
  error?: string;
}

export interface PaymentWebhook {
  id: string;
  provider: string;
  event: string;
  data: Record<string, any>;
  processed: boolean;
  createdAt: Date;
  processedAt?: Date;
}

