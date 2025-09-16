-- =====================================================
-- SCRIPT DE CONFIGURACIÓN COMPLETA DE BASE DE DATOS
-- Hotel PMS - Paseo Las Mercedes
-- =====================================================

-- Crear extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLAS DE AUTENTICACIÓN (NextAuth.js)
-- =====================================================

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- =====================================================
-- TABLAS PRINCIPALES DEL HOTEL
-- =====================================================

-- CreateTable
CREATE TABLE "hotels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "tax_id" TEXT,
    "logo_url" TEXT,
    "default_currency" TEXT NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "image" TEXT,
    "employee_id" TEXT,
    "phone" TEXT,
    "position" TEXT,
    "department" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "hotel_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "floors" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "floor_number" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "floors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "room_types" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "max_occupancy" INTEGER NOT NULL DEFAULT 1,
    "base_rate_usd" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "base_rate_usdt" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "base_rate_eur" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "base_rate_bnb" DECIMAL(10,8) NOT NULL DEFAULT 0,
    "base_rate_etc" DECIMAL(10,8) NOT NULL DEFAULT 0,
    "amenities" JSONB,
    "size_sqm" DOUBLE PRECISION,
    "bed_type" TEXT,
    "bed_count" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "room_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "room_number" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "floor_id" TEXT NOT NULL,
    "room_type_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "notes" TEXT,
    "last_cleaned" TIMESTAMP(3),
    "has_minibar" BOOLEAN NOT NULL DEFAULT false,
    "has_balcony" BOOLEAN NOT NULL DEFAULT false,
    "has_view" BOOLEAN NOT NULL DEFAULT false,
    "wifi_password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guests" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "document_type" TEXT,
    "document_number" TEXT,
    "nationality" TEXT,
    "date_of_birth" TIMESTAMP(3),
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "postal_code" TEXT,
    "vip_status" BOOLEAN NOT NULL DEFAULT false,
    "preferences" JSONB,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "guests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price_usd" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "price_usdt" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "price_eur" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "price_bnb" DECIMAL(10,8) NOT NULL DEFAULT 0,
    "price_etc" DECIMAL(10,8) NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_taxable" BOOLEAN NOT NULL DEFAULT true,
    "tax_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "reservation_number" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "guest_id" TEXT NOT NULL,
    "check_in_date" TIMESTAMP(3) NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "nights" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "room_rate" DECIMAL(10,2) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "taxes" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discounts" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "payment_status" TEXT NOT NULL DEFAULT 'PENDING',
    "actual_check_in" TIMESTAMP(3),
    "actual_check_out" TIMESTAMP(3),
    "check_in_by" TEXT,
    "check_out_by" TEXT,
    "special_requests" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "reservation_id" TEXT,
    "room_id" TEXT,
    "guest_id" TEXT,
    "service_id" TEXT,
    "payment_method" TEXT,
    "reference_number" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- =====================================================
-- ÍNDICES ÚNICOS
-- =====================================================

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_employee_id_key" ON "users"("employee_id");
CREATE UNIQUE INDEX "floors_hotel_id_floor_number_key" ON "floors"("hotel_id", "floor_number");
CREATE UNIQUE INDEX "rooms_hotel_id_room_number_key" ON "rooms"("hotel_id", "room_number");
CREATE UNIQUE INDEX "guests_hotel_id_email_key" ON "guests"("hotel_id", "email");
CREATE UNIQUE INDEX "guests_hotel_id_document_type_document_number_key" ON "guests"("hotel_id", "document_type", "document_number");
CREATE UNIQUE INDEX "reservations_reservation_number_key" ON "reservations"("reservation_number");

-- =====================================================
-- LLAVES FORÁNEAS
-- =====================================================

ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "floors" ADD CONSTRAINT "floors_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_floor_id_fkey" FOREIGN KEY ("floor_id") REFERENCES "floors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_room_type_id_fkey" FOREIGN KEY ("room_type_id") REFERENCES "room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "guests" ADD CONSTRAINT "guests_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "services" ADD CONSTRAINT "services_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_check_in_by_fkey" FOREIGN KEY ("check_in_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_check_out_by_fkey" FOREIGN KEY ("check_out_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_guest_id_fkey" FOREIGN KEY ("guest_id") REFERENCES "guests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- =====================================================
-- DATOS INICIALES
-- =====================================================

-- Insertar hotel por defecto
INSERT INTO "hotels" ("id", "name", "address", "phone", "email", "description", "default_currency", "created_at", "updated_at") 
VALUES ('hotel-001', 'Hotel Paseo Las Mercedes', 'Paseo Las Mercedes, Caracas, Venezuela', '+58-212-123-4567', 'info@hotelpaseolasmercedes.com', 'Hotel de lujo en el corazón de Caracas', 'USD', NOW(), NOW());

-- Insertar roles por defecto
INSERT INTO "roles" ("id", "name", "description", "permissions", "created_at", "updated_at") 
VALUES 
('role-admin', 'Administrador', 'Acceso completo al sistema', '["all"]', NOW(), NOW()),
('role-reception', 'Recepcionista', 'Gestión de reservas y huéspedes', '["reservations", "guests", "rooms", "checkin", "checkout"]', NOW(), NOW()),
('role-housekeeping', 'Limpieza', 'Gestión de tareas de limpieza', '["housekeeping", "rooms"]', NOW(), NOW());

-- Insertar usuario administrador por defecto
INSERT INTO "users" ("id", "name", "first_name", "last_name", "email", "password", "employee_id", "phone", "position", "department", "is_active", "hotel_id", "role_id", "created_at", "updated_at", "created_by") 
VALUES ('user-admin-001', 'Administrador', 'Admin', 'Sistema', 'admin@hotelpms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'EMP001', '+58-212-123-4567', 'Administrador', 'Administración', true, 'hotel-001', 'role-admin', NOW(), NOW(), 'user-admin-001');

-- Insertar usuario recepcionista por defecto
INSERT INTO "users" ("id", "name", "first_name", "last_name", "email", "password", "employee_id", "phone", "position", "department", "is_active", "hotel_id", "role_id", "created_at", "updated_at", "created_by") 
VALUES ('user-reception-001', 'Recepcionista', 'Recepción', 'Principal', 'reception@hotelpms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'EMP002', '+58-212-123-4568', 'Recepcionista', 'Recepción', true, 'hotel-001', 'role-reception', NOW(), NOW(), 'user-admin-001');

-- Insertar tipos de habitación por defecto
INSERT INTO "room_types" ("id", "name", "description", "max_occupancy", "base_rate_usd", "base_rate_usdt", "base_rate_eur", "base_rate_bnb", "base_rate_etc", "amenities", "size_sqm", "bed_type", "bed_count", "created_at", "updated_at") 
VALUES 
('room-type-001', 'Habitación Individual', 'Habitación cómoda para una persona', 1, 80.00, 80.00, 70.00, 0.15, 0.15, '["WiFi", "TV", "Aire Acondicionado", "Baño Privado"]', 25.0, 'Individual', 1, NOW(), NOW()),
('room-type-002', 'Habitación Doble', 'Habitación espaciosa para dos personas', 2, 120.00, 120.00, 105.00, 0.22, 0.22, '["WiFi", "TV", "Aire Acondicionado", "Baño Privado", "Minibar"]', 35.0, 'Queen', 1, NOW(), NOW()),
('room-type-003', 'Suite', 'Suite de lujo con sala de estar', 4, 200.00, 200.00, 175.00, 0.37, 0.37, '["WiFi", "TV", "Aire Acondicionado", "Baño Privado", "Minibar", "Balcón", "Vista al Mar"]', 60.0, 'King', 1, NOW(), NOW());

-- Insertar pisos por defecto
INSERT INTO "floors" ("id", "hotel_id", "floor_number", "name", "description", "is_active", "created_at", "updated_at") 
VALUES 
('floor-001', 'hotel-001', 1, 'Piso 1', 'Planta baja', true, NOW(), NOW()),
('floor-002', 'hotel-001', 2, 'Piso 2', 'Segundo piso', true, NOW(), NOW()),
('floor-003', 'hotel-001', 3, 'Piso 3', 'Tercer piso', true, NOW(), NOW());

-- Insertar habitaciones de ejemplo
INSERT INTO "rooms" ("id", "room_number", "hotel_id", "floor_id", "room_type_id", "status", "has_minibar", "has_balcony", "has_view", "wifi_password", "created_at", "updated_at") 
VALUES 
('room-001', '101', 'hotel-001', 'floor-001', 'room-type-001', 'AVAILABLE', false, false, false, 'WIFI101', NOW(), NOW()),
('room-002', '102', 'hotel-001', 'floor-001', 'room-type-002', 'AVAILABLE', true, false, false, 'WIFI102', NOW(), NOW()),
('room-003', '201', 'hotel-001', 'floor-002', 'room-type-002', 'AVAILABLE', true, true, true, 'WIFI201', NOW(), NOW()),
('room-004', '301', 'hotel-001', 'floor-003', 'room-type-003', 'AVAILABLE', true, true, true, 'WIFI301', NOW(), NOW());

-- Insertar servicios por defecto
INSERT INTO "services" ("id", "hotel_id", "name", "description", "category", "price_usd", "price_usdt", "price_eur", "price_bnb", "price_etc", "is_active", "is_taxable", "tax_rate", "created_at", "updated_at") 
VALUES 
('service-001', 'hotel-001', 'Desayuno Continental', 'Desayuno continental completo', 'RESTAURANT', 15.00, 15.00, 13.00, 0.03, 0.03, true, true, 16.00, NOW(), NOW()),
('service-002', 'hotel-001', 'Servicio a la Habitación', 'Servicio de comida a la habitación', 'ROOM_SERVICE', 25.00, 25.00, 22.00, 0.05, 0.05, true, true, 16.00, NOW(), NOW()),
('service-003', 'hotel-001', 'Lavandería', 'Servicio de lavandería y planchado', 'LAUNDRY', 20.00, 20.00, 17.50, 0.04, 0.04, true, true, 16.00, NOW(), NOW());

-- =====================================================
-- MENSAJE DE CONFIRMACIÓN
-- =====================================================

SELECT 'Base de datos configurada exitosamente para Hotel PMS - Paseo Las Mercedes' as message;
