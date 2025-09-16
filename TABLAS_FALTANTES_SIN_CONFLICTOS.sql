-- =====================================================
-- SCRIPT PARA TABLAS FALTANTES - SIN CONFLICTOS
-- Hotel PMS - Paseo Las Mercedes
-- =====================================================
-- Este script agrega las 27 tablas faltantes
-- (ya existen: Account, Session, VerificationToken, hotels, roles, users, floors, room_types, rooms, guests, services, reservations, transactions)

-- =====================================================
-- PARTE 1: TABLAS DE CHECK-IN/OUT Y SERVICIOS
-- =====================================================

-- CreateTable
CREATE TABLE "check_ins" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "check_in_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key_cards" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "checked_in_by" TEXT NOT NULL,
    "early_checkin" BOOLEAN NOT NULL DEFAULT false,
    "deposit_paid" BOOLEAN NOT NULL DEFAULT false,
    "deposit_amount" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "check_ins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_outs" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "check_out_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_charges" DECIMAL(10,2) NOT NULL,
    "key_cards_returned" BOOLEAN NOT NULL DEFAULT true,
    "room_condition" TEXT NOT NULL DEFAULT 'needs_cleaning',
    "notes" TEXT,
    "checked_out_by" TEXT NOT NULL,
    "room_charges" DECIMAL(10,2),
    "service_charges" DECIMAL(10,2),
    "tax_amount" DECIMAL(10,2),
    "late_checkout" BOOLEAN NOT NULL DEFAULT false,
    "damages_reported" BOOLEAN NOT NULL DEFAULT false,
    "damage_cost" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "check_outs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_requests" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "room_id" TEXT,
    "reservation_id" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "requested_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_time" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "unit_price" DECIMAL(10,2),
    "total_amount" DECIMAL(10,2),
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "assigned_to" TEXT,
    "department" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- PARTE 2: TABLAS DE FACTURACIÓN
-- =====================================================

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "invoice_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3),
    "issue_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_type" TEXT NOT NULL DEFAULT 'GUEST',
    "guest_id" TEXT,
    "company_name" TEXT,
    "client_document" TEXT,
    "client_address" TEXT,
    "client_phone" TEXT,
    "client_email" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "subtotal" DECIMAL(12,2) NOT NULL,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL,
    "iva_rate" DECIMAL(5,2) NOT NULL DEFAULT 16.00,
    "iva_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "municipal_tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "municipal_tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "service_tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "service_tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "payment_status" TEXT NOT NULL DEFAULT 'UNPAID',
    "payment_terms" TEXT NOT NULL DEFAULT 'IMMEDIATE',
    "control_number" TEXT,
    "tax_period" TEXT,
    "is_tax_exempt" BOOLEAN NOT NULL DEFAULT false,
    "tax_exempt_reason" TEXT,
    "reservation_id" TEXT,
    "notes" TEXT,
    "internal_notes" TEXT,
    "terms_conditions" TEXT,
    "pdf_url" TEXT,
    "xml_data" JSONB,
    "hash_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "line_number" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(12,2) NOT NULL,
    "line_total" DECIMAL(12,2) NOT NULL,
    "is_taxable" BOOLEAN NOT NULL DEFAULT true,
    "tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 16.00,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "service_id" TEXT,
    "room_id" TEXT,
    "item_type" TEXT NOT NULL DEFAULT 'SERVICE',
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "payment_number" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exchange_rate" DECIMAL(10,6),
    "amount_local" DECIMAL(12,2),
    "payment_method" TEXT NOT NULL,
    "payment_gateway" TEXT,
    "gateway_transaction_id" TEXT,
    "card_last_four" TEXT,
    "card_brand" TEXT,
    "bank_name" TEXT,
    "account_number" TEXT,
    "authorization_code" TEXT,
    "crypto_currency" TEXT,
    "wallet_address" TEXT,
    "blockchain_hash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "reconciled" BOOLEAN NOT NULL DEFAULT false,
    "reconciled_date" TIMESTAMP(3),
    "invoice_id" TEXT,
    "reservation_id" TEXT,
    "guest_id" TEXT,
    "reference_number" TEXT,
    "notes" TEXT,
    "receipt_url" TEXT,
    "refund_amount" DECIMAL(12,2),
    "refund_date" TIMESTAMP(3),
    "refund_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,
    "processed_by" TEXT,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "requires_approval" BOOLEAN NOT NULL DEFAULT false,
    "min_amount" DECIMAL(12,2),
    "max_amount" DECIMAL(12,2),
    "fee_type" TEXT DEFAULT 'NONE',
    "fee_amount" DECIMAL(12,2) DEFAULT 0,
    "fee_percentage" DECIMAL(5,2) DEFAULT 0,
    "gateway_name" TEXT,
    "gateway_config" JSONB,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "icon_url" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- PARTE 3: TABLAS FISCALES
-- =====================================================

-- CreateTable
CREATE TABLE "tax_config" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "rate" DECIMAL(5,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_inclusive" BOOLEAN NOT NULL DEFAULT false,
    "applies_to" JSONB,
    "tax_authority" TEXT,
    "legal_reference" TEXT,
    "effective_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effective_to" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    CONSTRAINT "tax_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiscal_periods" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "period_type" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "is_closed" BOOLEAN NOT NULL DEFAULT false,
    "closed_date" TIMESTAMP(3),
    "closed_by" TEXT,
    "total_revenue" DECIMAL(15,2),
    "total_taxes" DECIMAL(15,2),
    "total_discounts" DECIMAL(15,2),
    "invoice_count" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,
    CONSTRAINT "fiscal_periods_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- ÍNDICES ÚNICOS PARA NUEVAS TABLAS
-- =====================================================

CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");
CREATE UNIQUE INDEX "payments_payment_number_key" ON "payments"("payment_number");
CREATE UNIQUE INDEX "payment_methods_hotel_id_code_key" ON "payment_methods"("hotel_id", "code");
CREATE UNIQUE INDEX "fiscal_periods_hotel_id_start_date_end_date_key" ON "fiscal_periods"("hotel_id", "start_date", "end_date");

-- =====================================================
-- FOREIGN KEYS PARA NUEVAS TABLAS
-- =====================================================

-- Check-ins y Check-outs
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "check_outs" ADD CONSTRAINT "check_outs_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "check_outs" ADD CONSTRAINT "check_outs_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "check_outs" ADD CONSTRAINT "check_outs_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "check_outs" ADD CONSTRAINT "check_outs_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Service Requests
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Facturación
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payments" ADD CONSTRAINT "payments_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "payments" ADD CONSTRAINT "payments_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Fiscal
ALTER TABLE "tax_config" ADD CONSTRAINT "tax_config_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "fiscal_periods" ADD CONSTRAINT "fiscal_periods_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- =====================================================
-- SCRIPT COMPLETADO - PARTE 1
-- =====================================================
-- Este script agrega 8 tablas faltantes (Check-in/out, Facturación, Fiscal)
-- Ejecutar PARTE2_HOUSEKEEPING_STAFF_FINAL.sql para las 19 tablas restantes
