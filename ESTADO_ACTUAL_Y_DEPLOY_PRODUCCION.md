
# 🏨 Estado Actual del Sistema y Deploy de Producción

## 📊 Estado Actual del Sistema

### Versión y Checkpoint
- **Versión Actual**: v9.0 - Sistema Completo (9 Fases)
- **Estado**: ✅ PRODUCTION READY
- **Última Actualización**: 1 de Octubre, 2025
- **Build Status**: ✅ Exitoso (67 páginas generadas)
- **Ubicación**: `/home/ubuntu/hotel_pms_paseo_las_mercedes`

### 📍 Base de Datos Actual

#### Ubicación de la Base de Datos:
```
HOST: db-a4a563bb9.db001.hosteddb.reai.io
PUERTO: 5432
BASE DE DATOS: a4a563bb9
USUARIO: role_a4a563bb9
REGIÓN: Servidor de Desarrollo Abacus.AI
```

**🔴 IMPORTANTE**: Esta base de datos es un **entorno de desarrollo/pruebas** hospedado en Abacus.AI. 

**NO debe usarse para producción** por las siguientes razones:
- Es temporal y puede ser eliminada
- No tiene backups automáticos configurados
- No tiene SLA de disponibilidad
- No está optimizada para cargas de producción
- Puede tener límites de almacenamiento/conexiones

---

## 🚀 Requisitos para Deploy de Producción

### 1. Base de Datos de Producción (REQUERIDO)

Para producción necesitas crear una **nueva base de datos PostgreSQL** en un servicio de hosting profesional.

#### Opciones Recomendadas:

##### A. Neon (PostgreSQL Serverless) - **⭐ Recomendado para Empezar**
**Ventajas:**
- Free tier generoso (3 proyectos, 3GB storage, 10GB egreso/mes)
- Setup instantáneo (2-3 minutos)
- Escalable automáticamente
- Backups automáticos
- Integración directa con Vercel

**Pricing:**
- Free: $0/mes (suficiente para hoteles pequeños)
- Pro: $19/mes (hoteles medianos)

**Setup:**
1. Ir a https://neon.tech
2. Crear cuenta (login con GitHub)
3. Crear nuevo proyecto "hotel-pms-produccion"
4. Seleccionar región más cercana
5. Copiar connection string
6. ✅ Listo - base de datos en 3 minutos

**Connection String Example:**
```
postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb
```

---

##### B. Supabase (PostgreSQL + Extras)
**Ventajas:**
- Free tier: 500MB database, 2GB bandwidth
- Incluye autenticación adicional
- Panel de administración visual
- API REST automática

**Pricing:**
- Free: $0/mes
- Pro: $25/mes

**Setup:**
1. Ir a https://supabase.com
2. Crear proyecto
3. Settings → Database → Connection string
4. Copiar connection string

---

##### C. Railway (All-in-One) - **⭐ Más Fácil Todo Incluido**
**Ventajas:**
- Incluye base de datos PostgreSQL automática
- Incluye hosting de la app
- $5/mes de crédito gratis
- Deploy en un click

**Pricing:**
- $5 inicial gratis
- Luego ~$10-15/mes según uso

**Setup:**
1. Ir a https://railway.app
2. "New Project" → "Deploy from GitHub repo"
3. Conectar tu repositorio
4. Railway crea automáticamente:
   - Base de datos PostgreSQL
   - Variable DATABASE_URL
   - Deploy de la app
5. ✅ Todo listo en 5 minutos

---

##### D. AWS RDS (Empresarial)
**Ventajas:**
- Máxima confiabilidad
- SLA 99.95%
- Backups automáticos
- Escalabilidad completa

**Pricing:**
- ~$20-50/mes (db.t3.micro con 20GB)

**Mejor para:**
- Hoteles grandes (50+ habitaciones)
- Operaciones 24/7 críticas

---

##### E. DigitalOcean Managed Database
**Ventajas:**
- $15/mes plan básico
- 1GB RAM, 10GB storage, 1 CPU
- Backups diarios automáticos
- Buena performance

**Pricing:**
- $15/mes plan básico
- $30/mes plan estándar

---

### 2. Migración de la Base de Datos

#### Opción A: Migración desde Cero (Recomendado para Producción)

**Pasos:**

1. **Crear nueva base de datos de producción** (elige una opción de arriba)

2. **Configurar DATABASE_URL en tu plataforma de deploy**
   ```env
   DATABASE_URL="postgresql://[nueva-url-de-produccion]"
   ```

3. **Aplicar el schema de Prisma** (durante el primer deploy)
   ```bash
   # Esto se hace automáticamente en el deploy o manualmente:
   npx prisma db push
   ```

4. **Crear datos iniciales** (usuario admin, configuración del hotel)
   - Opción 1: Usar los scripts de seed incluidos
   - Opción 2: Crear manualmente desde la UI después del deploy

**Ventajas:**
- Base de datos limpia
- Sin datos de prueba
- Óptima performance

---

#### Opción B: Migración de Datos Existentes

Si quieres mantener los datos de desarrollo:

**Pasos:**

1. **Exportar datos de desarrollo:**
```bash
# Conectar a la base de datos actual
pg_dump "postgresql://role_a4a563bb9:lMY2RR4lrIvERMLjoTpbC9f9SlRsmxRm@db-a4a563bb9.db001.hosteddb.reai.io:5432/a4a563bb9" > backup_desarrollo.sql
```

2. **Revisar y limpiar datos** (eliminar datos de prueba)

3. **Importar a producción:**
```bash
psql "[URL_BASE_DATOS_PRODUCCION]" < backup_desarrollo.sql
```

**⚠️ Advertencia**: Revisar bien los datos antes de importar. Eliminar:
- Usuarios de prueba
- Reservaciones de testing
- Datos temporales

---

### 3. Servicios Adicionales Necesarios

#### A. Stripe (Pagos) - **REQUERIDO**

**Estado Actual**: Configurado con claves de TEST
```env
STRIPE_SECRET_KEY="sk_test_51234567890_placeholder_key"
STRIPE_PUBLISHABLE_KEY="pk_test_51234567890_placeholder_key"
```

**Para Producción Necesitas:**

1. **Crear cuenta Stripe** (si no tienes)
   - Ir a https://stripe.com
   - Registrar el hotel
   - Completar verificación de identidad

2. **Activar modo Live**
   - Ir a Dashboard → cambiar a "Live mode"
   - Developers → API keys
   - Copiar claves LIVE:
     - `sk_live_...` (Secret Key)
     - `pk_live_...` (Publishable Key)

3. **Configurar Webhook**
   - Developers → Webhooks → Add endpoint
   - URL: `https://tu-dominio.com/api/stripe/webhook`
   - Eventos:
     - `checkout.session.completed`
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
   - Copiar Signing Secret: `whsec_...`

**Tiempo**: 2-5 días (verificación de identidad)
**Costo**: Comisión por transacción (2.9% + $0.30)

---

#### B. NextAuth Secret - **REQUERIDO**

**Estado Actual**: Configurado para desarrollo
```env
NEXTAUTH_SECRET="K0oRFBbRS19HsDXg8zVe0DyK4W7KYBfY"
```

**Para Producción:**

Generar un nuevo secret aleatorio:
```bash
openssl rand -base64 32
```

**⚠️ CRÍTICO**: Nunca usar el mismo secret de desarrollo en producción.

---

#### C. URL de Producción - **REQUERIDO**

**Estado Actual**:
```env
NEXTAUTH_URL="https://d36476ae.preview.abacusai.app/"
```

**Para Producción:**

Cambiar a tu dominio final:
```env
# Opción 1: Dominio proporcionado por plataforma
NEXTAUTH_URL="https://hotel-pms.vercel.app"

# Opción 2: Tu propio dominio
NEXTAUTH_URL="https://pms.paseolasmercedeshotel.com"
```

---

## 🎯 Plan de Deploy Completo

### Escenario 1: Deploy Rápido con Vercel + Neon (Recomendado)

**Tiempo Total**: 30-45 minutos
**Costo Mensual**: $0 (free tier) o $19-25/mes (plan pro)
**Mejor Para**: Hoteles pequeños/medianos (hasta 100 habitaciones)

#### Pasos:

1. **Crear base de datos en Neon** (5 min)
   - https://neon.tech
   - Nuevo proyecto
   - Copiar connection string

2. **Preparar código para deploy** (5 min)
   ```bash
   cd /home/ubuntu/hotel_pms_paseo_las_mercedes
   
   # Crear repositorio en GitHub (si no existe)
   git init
   git add .
   git commit -m "Preparar para deploy de producción"
   git remote add origin [tu-repo-github]
   git push -u origin main
   ```

3. **Deploy en Vercel** (10 min)
   - Ir a https://vercel.com
   - "Import Project" desde GitHub
   - Seleccionar repositorio
   - Configurar:
     - Root Directory: `app`
     - Framework: Next.js
   - Agregar variables de entorno:
     ```env
     DATABASE_URL=[tu-connection-string-de-neon]
     NEXTAUTH_URL=[tu-url-de-vercel]
     NEXTAUTH_SECRET=[generar-nuevo]
     STRIPE_SECRET_KEY=[tu-sk-live]
     STRIPE_PUBLISHABLE_KEY=[tu-pk-live]
     STRIPE_WEBHOOK_SECRET=[tu-whsec]
     ```
   - Click "Deploy"

4. **Aplicar schema de base de datos** (5 min)
   ```bash
   # Desde tu máquina local o Vercel CLI
   DATABASE_URL=[url-de-neon] npx prisma db push
   ```

5. **Configurar Stripe webhook** (5 min)
   - Stripe Dashboard → Webhooks
   - Agregar endpoint: `https://tu-app.vercel.app/api/stripe/webhook`

6. **Verificar funcionamiento** (10 min)
   - Abrir la URL de producción
   - Crear cuenta de usuario
   - Probar login
   - Crear una habitación de prueba
   - Crear una reservación de prueba

✅ **¡Sistema en producción!**

---

### Escenario 2: Deploy Todo-en-Uno con Railway

**Tiempo Total**: 20-30 minutos
**Costo Mensual**: ~$10-15/mes
**Mejor Para**: Máxima simplicidad, "set and forget"

#### Pasos:

1. **Crear cuenta en Railway** (2 min)
   - https://railway.app
   - Login con GitHub

2. **Deploy desde GitHub** (15 min)
   - "New Project" → "Deploy from GitHub repo"
   - Conectar repositorio
   - Railway automáticamente:
     - Detecta Next.js
     - Crea base de datos PostgreSQL
     - Configura DATABASE_URL
     - Hace el deploy

3. **Agregar variables de entorno** (5 min)
   - Click en el servicio
   - Variables → Agregar:
     ```env
     NEXTAUTH_URL=[tu-url-railway]
     NEXTAUTH_SECRET=[generar-nuevo]
     STRIPE_SECRET_KEY=[live]
     STRIPE_PUBLISHABLE_KEY=[live]
     STRIPE_WEBHOOK_SECRET=[live]
     ```

4. **Schema y testing** (10 min)
   - Railway aplica schema automáticamente
   - Verificar funcionamiento

✅ **¡Sistema en producción con database incluida!**

---

### Escenario 3: Deploy Empresarial con AWS

**Tiempo Total**: 2-4 horas
**Costo Mensual**: ~$50-100/mes
**Mejor Para**: Hoteles grandes, requisitos empresariales

#### Componentes:
- RDS PostgreSQL ($20-40/mes)
- EC2 (t3.small o mejor) ($15-30/mes)
- Load Balancer ($15-20/mes)
- S3 para assets ($5-10/mes)

Guía completa en: `GUIA_DEPLOYMENT_PRODUCCION.md`

---

## 📋 Checklist Pre-Deploy

Antes de hacer el deploy, verificar:

### Base de Datos
- [ ] Nueva base de datos PostgreSQL creada
- [ ] Connection string copiado
- [ ] Region seleccionada (más cercana a usuarios)
- [ ] Backups configurados (si la plataforma lo ofrece)

### Stripe
- [ ] Cuenta Stripe verificada
- [ ] Modo "Live" activado
- [ ] Live API keys copiadas (sk_live y pk_live)
- [ ] Webhook configurado en Stripe Dashboard
- [ ] Webhook secret copiado

### Variables de Entorno
- [ ] DATABASE_URL (nueva base de datos)
- [ ] NEXTAUTH_URL (dominio de producción)
- [ ] NEXTAUTH_SECRET (nuevo, generado)
- [ ] STRIPE_SECRET_KEY (live)
- [ ] STRIPE_PUBLISHABLE_KEY (live)
- [ ] STRIPE_WEBHOOK_SECRET (live)

### Código
- [ ] Código en GitHub/GitLab
- [ ] Build local funciona (`yarn build`)
- [ ] Sin errores TypeScript
- [ ] .env en .gitignore

### Post-Deploy
- [ ] Schema aplicado en DB (`prisma db push`)
- [ ] Usuario admin creado
- [ ] Login funciona
- [ ] Habitaciones pueden crearse
- [ ] Reservaciones pueden crearse
- [ ] Checkout funciona
- [ ] Pagos funcionan (test en modo live)

---

## 💰 Comparación de Costos

### Opción 1: Free Tier (Empezar Sin Costo)
- **Vercel**: Free (Next.js hosting)
- **Neon**: Free tier (3GB database)
- **Stripe**: Solo comisiones por transacción (2.9% + $0.30)
- **Total**: $0/mes + comisiones de ventas

**Límites:**
- ~1,000 reservaciones/mes
- ~10GB bandwidth
- Suficiente para hoteles de 10-20 habitaciones

---

### Opción 2: Starter (~$20/mes)
- **Vercel**: $20/mes (Pro)
- **Neon**: $19/mes (Pro) o Supabase $25/mes
- **Stripe**: Comisiones
- **Total**: ~$40-45/mes + comisiones

**Capacidad:**
- Ilimitadas reservaciones
- ~100GB bandwidth
- Hoteles de 20-50 habitaciones

---

### Opción 3: Railway Todo-Incluido (~$15/mes)
- **Railway**: ~$10-15/mes (app + database + bandwidth)
- **Stripe**: Comisiones
- **Total**: ~$15/mes + comisiones

**Capacidad:**
- Ilimitadas reservaciones
- Hasta 50 habitaciones
- Más fácil de administrar

---

### Opción 4: Empresarial (~$80-150/mes)
- **AWS RDS**: $30-50/mes
- **AWS EC2**: $20-40/mes
- **AWS Load Balancer**: $15-20/mes
- **S3 + CloudFront**: $10-20/mes
- **Backup/Monitoring**: $10-20/mes
- **Total**: ~$80-150/mes

**Capacidad:**
- Hoteles grandes (100+ habitaciones)
- Alta disponibilidad
- Performance empresarial

---

## 🎯 Recomendación por Tamaño de Hotel

### Hotel Pequeño (10-20 habitaciones)
**Recomendación**: Vercel + Neon (Free Tier)
- Costo: $0/mes
- Setup: 30 minutos
- Suficiente capacidad

### Hotel Mediano (20-50 habitaciones)
**Recomendación**: Railway o Vercel Pro + Neon
- Costo: $15-40/mes
- Setup: 30-45 minutos
- Escalable fácilmente

### Hotel Grande (50+ habitaciones)
**Recomendación**: AWS o DigitalOcean
- Costo: $80-150/mes
- Setup: 2-4 horas
- Máxima confiabilidad

---

## 📞 Próximos Pasos

### Paso 1: Decidir Plataforma
Elige una opción según tamaño del hotel y presupuesto.

### Paso 2: Crear Base de Datos
Seguir guía de la plataforma elegida arriba.

### Paso 3: Configurar Stripe
Activar modo live y obtener credenciales.

### Paso 4: Deploy
Seguir guía específica de tu plataforma en `GUIA_DEPLOYMENT_PRODUCCION.md`

### Paso 5: Verificar
Usar checklist de arriba para validar todo funciona.

---

## 🚨 Importante

### NO uses la base de datos actual de desarrollo para producción

La base de datos actual en `db-a4a563bb9.db001.hosteddb.reai.io` es:
- ❌ Temporal
- ❌ Sin backups
- ❌ Sin SLA
- ❌ Puede ser eliminada en cualquier momento

Para producción DEBES crear una nueva base de datos en un servicio profesional.

---

## 📚 Documentación Adicional

- `GUIA_DEPLOYMENT_PRODUCCION.md` - Guía paso a paso detallada
- `VARIABLES_ENTORNO_PRODUCCION.md` - Todas las variables explicadas
- `RESUMEN_CHECKPOINT_DEPLOY.md` - Estado actual del sistema
- `CHECKPOINT_RESUMEN.md` - Detalles técnicos

---

**Sistema**: Hotel PMS Paseo Las Mercedes v9.0  
**Estado**: ✅ PRODUCTION READY  
**Fecha**: 1 de Octubre, 2025

