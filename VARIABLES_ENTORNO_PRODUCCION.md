
# 🔐 Variables de Entorno para Producción

## 📋 Resumen

Este documento lista todas las variables de entorno necesarias para deployar el Hotel PMS "Paseo Las Mercedes" en producción.

---

## 🔑 Variables Críticas (REQUERIDAS)

### 1. Base de Datos

```env
# PostgreSQL Database URL
DATABASE_URL="postgresql://usuario:password@host:5432/database_name?schema=public"
```

**Formato:**
```
postgresql://[usuario]:[password]@[host]:[puerto]/[database]?schema=public
```

**Ejemplos por Plataforma:**

#### Vercel + Neon/Supabase:
```env
DATABASE_URL="postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb"
```

#### Railway:
```env
# Railway crea automáticamente esta variable
DATABASE_URL="postgresql://postgres:password@containers-us-west-1.railway.app:1234/railway"
```

#### AWS RDS:
```env
DATABASE_URL="postgresql://admin:password@hotel-pms.c1a2b3c4d5e6.us-east-1.rds.amazonaws.com:5432/hotelpms"
```

#### DigitalOcean:
```env
DATABASE_URL="postgresql://doadmin:password@db-postgresql-nyc3-12345-do-user-123456-0.b.db.ondigitalocean.com:25060/defaultdb?sslmode=require"
```

---

### 2. NextAuth.js (Autenticación)

```env
# URL completa de la aplicación en producción
NEXTAUTH_URL="https://tu-dominio.com"

# Secret para firmar tokens JWT (CRÍTICO - debe ser aleatorio y seguro)
NEXTAUTH_SECRET="tu-secreto-aleatorio-de-minimo-32-caracteres"
```

**Generar NEXTAUTH_SECRET:**
```bash
# Opción 1: OpenSSL (Recomendado)
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Online
# https://generate-secret.vercel.app/32
```

**Ejemplo:**
```env
NEXTAUTH_URL="https://hotel-pms.vercel.app"
NEXTAUTH_SECRET="Kx3k9vJ2mPqR8wT4nB6cE5dF7gH8iL0m="
```

---

### 3. Stripe (Pagos)

```env
# Stripe Secret Key (sk_live_... para producción)
STRIPE_SECRET_KEY="sk_live_YOUR_SECRET_KEY_HERE"

# Stripe Publishable Key (pk_live_... para producción)
STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_PUBLISHABLE_KEY_HERE"

# Stripe Webhook Secret (whsec_... para producción)
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"
```

**Obtener Claves de Stripe:**

1. Ir a [Stripe Dashboard](https://dashboard.stripe.com)
2. Cambiar a "Live mode" (esquina superior derecha)
3. Ir a Developers → API keys
   - **Secret key:** `sk_live_...`
   - **Publishable key:** `pk_live_...`
4. Configurar Webhook:
   - Ir a Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://tu-dominio.com/api/stripe/webhook`
   - Eventos a escuchar:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `invoice.paid`
     - `invoice.payment_failed`
   - Copiar el "Signing secret": `whsec_...`

**Ejemplo:**
```env
STRIPE_SECRET_KEY="sk_live_YOUR_SECRET_KEY_HERE"
STRIPE_PUBLISHABLE_KEY="pk_live_YOUR_PUBLISHABLE_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"
```

---

## 📦 Variables Opcionales (Recomendadas)

### 4. AWS S3 (Almacenamiento de Archivos)

```env
# AWS Credentials (si se usa S3 para almacenar archivos)
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="hotel-pms-uploads"
```

**Crear Bucket en S3:**
1. Ir a [AWS S3 Console](https://console.aws.amazon.com/s3)
2. Crear nuevo bucket
3. Configurar permisos (Block public access)
4. Crear usuario IAM con permisos S3
5. Generar Access Key

---

### 5. SendGrid (Emails)

```env
# SendGrid API Key (para enviar emails)
SENDGRID_API_KEY="SG.1234567890abcdefghijklmnopqrstuvwxyz"

# Email del remitente
SENDGRID_FROM_EMAIL="noreply@tu-hotel.com"
SENDGRID_FROM_NAME="Hotel Paseo Las Mercedes"
```

**Obtener SendGrid API Key:**
1. Ir a [SendGrid](https://sendgrid.com)
2. Settings → API Keys
3. Create API Key
4. Verificar dominio en Email API → Sender Authentication

---

### 6. Email Alternativo (AWS SES)

```env
# AWS SES (alternativa a SendGrid)
AWS_SES_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SES_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_SES_REGION="us-east-1"
AWS_SES_FROM_EMAIL="noreply@tu-hotel.com"
```

---

### 7. Sentry (Error Tracking)

```env
# Sentry DSN (para tracking de errores)
NEXT_PUBLIC_SENTRY_DSN="https://abcd1234@o123456.ingest.sentry.io/1234567"
SENTRY_AUTH_TOKEN="sntrys_1234567890abcdefghijklmnopqrstuvwxyz"
```

---

### 8. Google Analytics

```env
# Google Analytics Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

---

## 📝 Archivo .env Completo para Producción

### Versión Mínima (Solo Variables Críticas):

```env
# ====================================
# HOTEL PMS - PRODUCCIÓN
# ====================================

# Database
DATABASE_URL="postgresql://usuario:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="generar-con-openssl-rand-base64-32"

# Stripe (Live Mode)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

### Versión Completa (Con Servicios Opcionales):

```env
# ====================================
# HOTEL PMS - PRODUCCIÓN COMPLETA
# ====================================

# Database
DATABASE_URL="postgresql://usuario:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="generar-con-openssl-rand-base64-32"

# Stripe (Live Mode)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AWS S3 (Uploads)
AWS_ACCESS_KEY_ID="AKIAIOSFODNN7EXAMPLE"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="hotel-pms-uploads"

# SendGrid (Emails)
SENDGRID_API_KEY="SG...."
SENDGRID_FROM_EMAIL="noreply@tu-hotel.com"
SENDGRID_FROM_NAME="Hotel Paseo Las Mercedes"

# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN="https://...@sentry.io/..."
SENTRY_AUTH_TOKEN="sntrys_..."

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"

# Node Environment
NODE_ENV="production"
```

---

## 🚀 Configuración por Plataforma

### Vercel

**Agregar variables en Dashboard:**
1. Ir a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agregar cada variable una por una
4. Marcar en qué environments aplica (Production, Preview, Development)

**Vía CLI:**
```bash
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
# etc...
```

---

### Railway

**Agregar variables en Dashboard:**
1. Ir a tu proyecto en Railway
2. Click en el servicio
3. Variables → New Variable
4. Agregar todas las variables

**Nota:** Railway crea automáticamente `DATABASE_URL` si agregas una base de datos PostgreSQL

---

### AWS (EC2)

**Crear archivo .env en el servidor:**
```bash
# SSH al servidor
ssh ubuntu@tu-servidor.com

# Ir al directorio de la app
cd /var/www/hotel-pms/app

# Crear .env
nano .env

# Pegar todas las variables
# Guardar con Ctrl+X, Y, Enter

# Reiniciar servicio
pm2 restart hotel-pms
```

---

### DigitalOcean App Platform

**Agregar variables en Dashboard:**
1. Ir a tu app en DigitalOcean
2. Settings → App-Level Environment Variables
3. Agregar todas las variables
4. Deploy nuevamente

---

## 🔒 Seguridad

### ⚠️ Reglas de Seguridad Críticas:

1. **NUNCA** commitear archivo `.env` a git
   ```bash
   # Verificar que .env esté en .gitignore
   echo ".env" >> .gitignore
   ```

2. **NUNCA** compartir variables de entorno públicamente

3. **SIEMPRE** usar diferentes secrets para dev/staging/prod

4. **ROTAR** secrets periódicamente (cada 3-6 meses)

5. **LIMITAR** acceso a variables de entorno solo a personal necesario

---

## ✅ Checklist de Configuración

Antes de deploy a producción, verificar:

- [ ] `DATABASE_URL` configurado con base de datos de producción
- [ ] `NEXTAUTH_URL` apunta al dominio de producción (con HTTPS)
- [ ] `NEXTAUTH_SECRET` es aleatorio y único (32+ caracteres)
- [ ] `STRIPE_SECRET_KEY` es clave LIVE (sk_live_...)
- [ ] `STRIPE_PUBLISHABLE_KEY` es clave LIVE (pk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET` configurado correctamente
- [ ] Webhook de Stripe apunta a `https://dominio.com/api/stripe/webhook`
- [ ] Archivo `.env` NO está en el repositorio Git
- [ ] Variables de test/desarrollo eliminadas
- [ ] Todas las variables críticas tienen valores válidos

---

## 🧪 Testing de Variables

### Script de Verificación:

```javascript
// scripts/verify-env.js
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
];

console.log('🔍 Verificando variables de entorno...\n');

let allPresent = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
    allPresent = false;
  } else {
    console.log(`✅ ${varName}: Configurada`);
  }
});

if (allPresent) {
  console.log('\n✅ Todas las variables críticas están configuradas');
  process.exit(0);
} else {
  console.log('\n❌ Faltan variables de entorno críticas');
  process.exit(1);
}
```

**Ejecutar:**
```bash
cd app
node scripts/verify-env.js
```

---

## 📞 Soporte

Si tienes problemas con la configuración de variables de entorno:

1. Verificar que no haya espacios extra al inicio/final de los valores
2. Verificar que las comillas estén correctamente cerradas
3. Para URLs, incluir el protocolo completo (https://)
4. Para Stripe, asegurar que estés en "Live mode" en el dashboard
5. Probar conexión a base de datos con `psql $DATABASE_URL`

---

**Última actualización:** 1 de Octubre, 2025  
**Sistema:** Hotel PMS Paseo Las Mercedes v9.0

