
# 🚀 Flujo Completo de Deploy - Hotel PMS

**Fecha:** 1 de octubre de 2025  
**Estado:** Configuración actualizada para crear tablas automáticamente

---

## ✅ Aclaración Importante sobre las Tablas

### ❓ ¿Por qué no veo tablas en Neon todavía?

**Esto es NORMAL.** Las tablas NO se crean al crear la cuenta en Neon. Se crearán automáticamente durante el **primer deploy en Vercel**.

### 🔄 ¿Cuándo se crean las tablas?

Las tablas se crean cuando Vercel ejecuta el build por primera vez, siguiendo este proceso:

```
1. Vercel clona el repositorio de GitHub
2. Ejecuta: yarn install (instala dependencias)
3. Ejecuta: npx prisma generate (genera el cliente de Prisma)
4. Ejecuta: npx prisma migrate deploy ← ⭐ AQUÍ SE CREAN LAS TABLAS
5. Ejecuta: yarn build (construye la aplicación Next.js)
6. Deploy completado ✅
```

---

## 📋 Cambios Realizados (Commit: 8632a17)

He actualizado el `vercel.json` para incluir las migraciones automáticas:

```json
{
  "buildCommand": "npx prisma generate && npx prisma migrate deploy && yarn build",
  "installCommand": "yarn install"
}
```

El comando `npx prisma migrate deploy` es el que crea todas las tablas en la base de datos de Neon.

---

## 🎯 Flujo Completo del Deploy

### Paso 1: Preparación (✅ Ya completado)

- ✅ Base de datos Neon creada
- ✅ Repositorio GitHub actualizado
- ✅ Migraciones de Prisma listas
- ✅ `vercel.json` configurado

### Paso 2: Configurar Vercel (🔄 Ahora)

1. **Root Directory:** `app`

2. **Framework Preset:** 
   - Si aparece "Next.js" → Perfecto
   - Si aparece "Other" → Continuar (no es problema)

3. **Environment Variables:**

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:TU_PASSWORD@ep-cool-sea-a5jt7r2q-pooler.us-east-2.aws.neon.tech/hotel_pms_production?sslmode=require&pgbouncer=true&connect_timeout=10` |
| `NEXTAUTH_URL` | `https://hotel-pms-paseo-las-mercedes.vercel.app` |
| `NEXTAUTH_SECRET` | `aG8t3lP@s30L@sM3rc3d3s!2024#PMS$V3rc3l%S3cr3t&K3y*S3cur3!` |
| `NODE_ENV` | `production` |

4. **Hacer clic en "Deploy"**

### Paso 3: Durante el Deploy (⏳ Automático)

Vercel ejecutará:

```bash
# 1. Instalar dependencias
yarn install

# 2. Generar cliente de Prisma
npx prisma generate

# 3. ⭐ CREAR TABLAS EN NEON
npx prisma migrate deploy

# 4. Construir aplicación
yarn build
```

**🎉 En este momento se crearán TODAS las tablas en tu base de datos Neon.**

### Paso 4: Verificar Tablas Creadas (✅ Después del deploy)

Una vez completado el deploy, puedes verificar las tablas en Neon:

1. Ve a: https://console.neon.tech
2. Selecciona tu proyecto: **hotel_pms_production**
3. Ve a la pestaña **"Tables"** o **"SQL Editor"**
4. Ejecuta: `SELECT * FROM information_schema.tables WHERE table_schema = 'public';`

Deberías ver todas estas tablas:

- `User`
- `Account`
- `Session`
- `VerificationToken`
- `Guest`
- `Room`
- `Reservation`
- `Payment`
- `RoomServiceOrder`
- `ServiceItem`
- `MaintenanceRequest`
- `HousekeepingTask`
- `HousekeepingAssignment`
- `Staff`
- `GuestCommunication`
- `CommunicationTemplate`
- Y más...

---

## 🔍 Monitoreo del Deploy

### Ver el Progreso del Build

En Vercel Dashboard:
- Ve a la pestaña **"Deployments"**
- Haz clic en el deployment en progreso
- Ve a la pestaña **"Building"**

### Verificar que las Migraciones se Ejecutaron

En los logs del build, deberías ver algo como:

```
Running "npx prisma generate"
✔ Generated Prisma Client

Running "npx prisma migrate deploy"
Applying migration `20250810115033_initial_with_housekeeping`
Applying migration `20250810141625_add_guest_communications_and_templates`
✔ Migrations applied successfully

Running "yarn build"
...
```

---

## ⚠️ Posibles Errores y Soluciones

### Error: "Can't reach database server"

**Causa:** DATABASE_URL incorrecta o base de datos no accesible

**Solución:**
1. Verifica que la DATABASE_URL esté correcta en Environment Variables
2. Confirma que incluya `?sslmode=require&pgbouncer=true&connect_timeout=10`
3. Verifica que la contraseña sea correcta

### Error: "Migration failed"

**Causa:** Problema con las migraciones de Prisma

**Solución:**
1. Verifica que las migraciones existan en el repositorio
2. Revisa los logs específicos del error
3. Si es necesario, resetea la base de datos en Neon y vuelve a deployar

### Build exitoso pero la app no carga

**Causa:** NEXTAUTH_URL incorrecta

**Solución:**
1. Copia la URL real de tu deployment de Vercel
2. Actualiza NEXTAUTH_URL en Environment Variables
3. Re-deploya desde Vercel Dashboard

---

## 🎯 Después del Deploy

### 1. Actualizar NEXTAUTH_URL

```bash
# La URL real será algo como:
https://hotel-pms-paseo-las-mercedes-abc123.vercel.app
```

1. Copia la URL de tu deployment
2. Ve a: Vercel Dashboard → Settings → Environment Variables
3. Edita `NEXTAUTH_URL` con la URL correcta
4. Re-deploya: Deployments → ⋮ → Redeploy

### 2. Crear Usuario Administrador

Una vez que la app esté funcionando:

1. Ve a: `https://tu-app.vercel.app/signup`
2. Crea el primer usuario (será administrador)
3. Inicia sesión

### 3. Poblar Datos Iniciales

Si quieres poblar datos de prueba:

1. Ve a Neon SQL Editor
2. Ejecuta el script de seed (si existe)
3. O crea los datos manualmente desde la aplicación

---

## 📊 Resumen del Estado Actual

| Item | Estado |
|------|--------|
| Base de datos Neon | ✅ Creada |
| Tablas en Neon | ⏳ Se crearán durante el deploy |
| Repositorio GitHub | ✅ Actualizado (commit: 8632a17) |
| Migraciones Prisma | ✅ Listas |
| Configuración Vercel | 🔄 En proceso |
| Deploy | ⏳ Pendiente |

---

## 🚦 Próximos Pasos Inmediatos

1. ✅ **Tienes la contraseña de Neon lista**
2. 🔄 **Configurar las Environment Variables en Vercel**
3. 🔄 **Hacer clic en "Deploy"**
4. ⏳ **Esperar a que el build termine** (2-3 minutos)
5. ✅ **Verificar que las tablas se crearon en Neon**
6. ✅ **Actualizar NEXTAUTH_URL si es necesario**
7. ✅ **Probar la aplicación**

---

## 💡 Nota Final

**NO necesitas crear las tablas manualmente.** El sistema las creará automáticamente durante el primer deploy. Solo asegúrate de tener la `DATABASE_URL` correcta en las variables de entorno de Vercel.

---

**Última actualización:** 1 de octubre de 2025 - 16:15  
**Commit actual:** 8632a17  
**Branch:** master
