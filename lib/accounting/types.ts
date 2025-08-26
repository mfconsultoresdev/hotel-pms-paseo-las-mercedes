export interface AccountingConfig {
  provider: 'quickbooks' | 'xero' | 'sage' | 'netsuite' | 'local';
  isActive: boolean;
  isTestMode: boolean;
  apiKey: string;
  secretKey?: string;
  endpoint: string;
  credentials: Record<string, any>;
  syncInterval: number; // minutes
  lastSync?: Date;
  companyId?: string;
  fiscalYearStart?: string;
  currency: string;
  timezone: string;
}

export interface ChartOfAccounts {
  id: string;
  accountNumber: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  category: string;
  subcategory?: string;
  description?: string;
  isActive: boolean;
  parentAccountId?: string;
  balance: number;
  currency: string;
  lastUpdated: Date;
}

export interface JournalEntry {
  id: string;
  entryNumber: string;
  date: Date;
  reference: string;
  description: string;
  status: 'draft' | 'posted' | 'voided';
  totalDebit: number;
  totalCredit: number;
  currency: string;
  lines: JournalEntryLine[];
  metadata: Record<string, any>;
  createdAt: Date;
  postedAt?: Date;
  voidedAt?: Date;
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  accountNumber: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  currency: string;
  taxCode?: string;
  taxAmount?: number;
  department?: string;
  project?: string;
  metadata?: Record<string, any>;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  date: Date;
  dueDate: Date;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  sentAt?: Date;
  paidAt?: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
  accountId?: string;
  metadata?: Record<string, any>;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  date: Date;
  amount: number;
  currency: string;
  method: 'cash' | 'check' | 'credit_card' | 'bank_transfer' | 'digital_wallet';
  reference?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  gatewayTransactionId?: string;
  metadata: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  vendorId: string;
  vendorName: string;
  date: Date;
  dueDate?: Date;
  category: string;
  description: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  paidAt?: Date;
  receiptUrl?: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

export interface Vendor {
  id: string;
  vendorNumber: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  balance: number;
  currency: string;
  isActive: boolean;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaxCode {
  id: string;
  code: string;
  name: string;
  rate: number;
  type: 'sales' | 'purchase' | 'both';
  isActive: boolean;
  description?: string;
  metadata?: Record<string, any>;
}

export interface FinancialReport {
  id: string;
  type: 'balance_sheet' | 'income_statement' | 'cash_flow' | 'trial_balance';
  period: string;
  startDate: Date;
  endDate: Date;
  currency: string;
  data: Record<string, any>;
  generatedAt: Date;
  metadata?: Record<string, any>;
}

export interface SyncRequest {
  type: 'accounts' | 'transactions' | 'invoices' | 'payments' | 'expenses' | 'vendors' | 'customers';
  startDate?: string;
  endDate?: string;
  entityIds?: string[];
  forceFullSync?: boolean;
}

export interface SyncResponse {
  success: boolean;
  data?: any;
  message: string;
  error?: string;
  syncTimestamp: Date;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsDeleted: number;
}

export interface AccountingSettings {
  autoSync: boolean;
  syncInterval: number;
  autoPostEntries: boolean;
  requireApproval: boolean;
  defaultTaxCode: string;
  defaultPaymentTerms: string;
  fiscalYearEnd: string;
  multiCurrency: boolean;
  baseCurrency: string;
  exchangeRateProvider: string;
  roundingMethod: 'round' | 'floor' | 'ceil';
  decimalPlaces: number;
  autoNumbering: boolean;
  numberPrefix: string;
  nextNumber: number;
}

export interface ExchangeRate {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  date: Date;
  source: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Reconciliation {
  id: string;
  accountId: string;
  accountName: string;
  period: string;
  startDate: Date;
  endDate: Date;
  bankBalance: number;
  bookBalance: number;
  difference: number;
  status: 'pending' | 'in_progress' | 'completed' | 'discrepancy';
  reconciledBy?: string;
  reconciledAt?: Date;
  notes?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

