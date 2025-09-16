#!/bin/bash

# 🚀 Script de Inicialización del Proyecto PMS
# Hotel Paseo Las Mercedes

set -e

echo "🏨 Inicializando Proyecto PMS - Hotel Paseo Las Mercedes"
echo "=================================================="

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si Node.js está instalado
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js no está instalado. Por favor instala Node.js 18.x o superior."
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js encontrado: $NODE_VERSION"
}

# Verificar si npm está instalado
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm no está instalado."
        exit 1
    fi
    
    NPM_VERSION=$(npm --version)
    print_success "npm encontrado: $NPM_VERSION"
}

# Verificar si PostgreSQL está disponible
check_postgres() {
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL no encontrado. Asegúrate de tener PostgreSQL instalado y ejecutándose."
        print_warning "Puedes usar Docker: docker run --name hotel-pms-db -e POSTGRES_DB=hotel_pms_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15"
    else
        print_success "PostgreSQL encontrado"
    fi
}

# Crear archivo .env.local si no existe
create_env_file() {
    if [ ! -f ".env.local" ]; then
        print_status "Creando archivo .env.local..."
        cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/hotel_pms_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="hotel-pms-secret-key-2024"

# Stripe Configuration (Optional - for payment processing)
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Hotel PMS - Paseo Las Mercedes"

# Development Configuration
NODE_ENV="development"
EOF
        print_success "Archivo .env.local creado"
    else
        print_warning "Archivo .env.local ya existe"
    fi
}

# Instalar dependencias
install_dependencies() {
    print_status "Instalando dependencias..."
    npm install
    print_success "Dependencias instaladas"
}

# Generar cliente Prisma
generate_prisma() {
    print_status "Generando cliente Prisma..."
    npx prisma generate
    print_success "Cliente Prisma generado"
}

# Ejecutar migraciones
run_migrations() {
    print_status "Ejecutando migraciones de base de datos..."
    npx prisma migrate dev --name init
    print_success "Migraciones ejecutadas"
}

# Poblar base de datos
seed_database() {
    print_status "Poblando base de datos con datos de prueba..."
    npm run seed
    print_success "Base de datos poblada"
}

# Verificar configuración
verify_setup() {
    print_status "Verificando configuración..."
    
    # Verificar archivos importantes
    if [ ! -f "package.json" ]; then
        print_error "package.json no encontrado"
        exit 1
    fi
    
    if [ ! -f "prisma/schema.prisma" ]; then
        print_error "Esquema de Prisma no encontrado"
        exit 1
    fi
    
    print_success "Configuración verificada"
}

# Función principal
main() {
    echo "Iniciando proceso de inicialización..."
    echo ""
    
    # Verificaciones previas
    check_node
    check_npm
    check_postgres
    echo ""
    
    # Configuración del proyecto
    create_env_file
    install_dependencies
    generate_prisma
    echo ""
    
    # Base de datos
    run_migrations
    seed_database
    echo ""
    
    # Verificación final
    verify_setup
    echo ""
    
    print_success "🎉 ¡Proyecto inicializado exitosamente!"
    echo ""
    echo "📋 Próximos pasos:"
    echo "1. Verifica la configuración en .env.local"
    echo "2. Asegúrate de que PostgreSQL esté ejecutándose"
    echo "3. Ejecuta: npm run dev"
    echo "4. Visita: http://localhost:3000"
    echo ""
    echo "🔑 Credenciales de prueba:"
    echo "   Admin: admin@hotelpms.com / admin123"
    echo "   Recepción: reception@hotelpms.com / reception123"
    echo ""
    echo "📚 Documentación: setup-project.md"
}

# Ejecutar función principal
main "$@"
