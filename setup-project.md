# 🚀 Guía de Inicialización del Proyecto PMS

## 📋 Pasos para Inicializar el Proyecto

### 1. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto (`hotel_pms_paseo_las_mercedes/app/`) con el siguiente contenido:

```env
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
```

### 2. Instalar Dependencias

```bash
cd hotel_pms_paseo_las_mercedes/app
npm install
```

### 3. Configurar Base de Datos PostgreSQL

#### Opción A: PostgreSQL Local
1. Instalar PostgreSQL
2. Crear base de datos:
```sql
CREATE DATABASE hotel_pms_db;
```

#### Opción B: Docker (Recomendado)
```bash
docker run --name hotel-pms-db \
  -e POSTGRES_DB=hotel_pms_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### 4. Ejecutar Migraciones de Base de Datos

```bash
npx prisma migrate dev
```

### 5. Generar Cliente Prisma

```bash
npx prisma generate
```

### 6. Poblar Base de Datos con Datos de Prueba

```bash
npm run seed
```

### 7. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

El proyecto estará disponible en: http://localhost:3000

## 🔑 Credenciales de Prueba

### Usuario Administrador
- **Email**: admin@hotelpms.com
- **Password**: admin123

### Usuario Recepcionista
- **Email**: reception@hotelpms.com
- **Password**: reception123

## 📁 Estructura del Proyecto

```
app/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Rutas protegidas
│   ├── api/               # API Routes
│   └── auth/              # Autenticación
├── components/            # Componentes React
├── lib/                   # Utilidades y configuración
├── prisma/               # Esquema de base de datos
└── scripts/              # Scripts de seeding
```

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo
npm run build            # Construir para producción
npm run start            # Iniciar servidor de producción
npm run lint             # Ejecutar linter

# Base de datos
npx prisma studio        # Abrir Prisma Studio
npx prisma migrate dev   # Ejecutar migraciones
npx prisma generate      # Generar cliente Prisma
npx prisma db seed       # Poblar con datos de prueba

# Limpieza
npm run clean            # Limpiar archivos de build
```

## 🚨 Solución de Problemas

### Error de Conexión a Base de Datos
1. Verificar que PostgreSQL esté ejecutándose
2. Verificar la URL de conexión en `.env.local`
3. Verificar que la base de datos existe

### Error de Migraciones
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Error de Dependencias
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

Si encuentras problemas durante la inicialización, verifica:
1. Versión de Node.js (recomendado: 18.x o superior)
2. Versión de PostgreSQL (recomendado: 15.x o superior)
3. Variables de entorno configuradas correctamente
4. Puerto 3000 disponible
