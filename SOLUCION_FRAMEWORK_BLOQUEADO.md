
# 🔧 Solución: Framework Preset Bloqueado en Vercel

**Fecha:** 1 de octubre de 2025  
**Problema:** El Framework Preset aparece bloqueado en "Other" y no permite seleccionar Next.js manualmente

## ✅ Cambios Realizados

He simplificado el `vercel.json` para permitir la detección automática:

```json
{
  "buildCommand": "npx prisma generate && yarn build",
  "installCommand": "yarn install"
}
```

Los cambios ya están en GitHub (commit: `cb13e3b`)

---

## 📋 Pasos para Importar en Vercel

### Opción 1: Reintentar la Importación (RECOMENDADO)

1. **Cancelar** el proceso actual de importación en Vercel
2. **Actualizar** la página de Vercel para limpiar el caché
3. Ir a: https://vercel.com/new
4. Hacer clic en **"Import"** nuevamente desde GitHub
5. Seleccionar el repositorio: `mfconsultoresdev/hotel-pms-paseo-las-mercedes`

### Configuración en Vercel:

#### 1️⃣ Root Directory
```
app
```

#### 2️⃣ Framework Preset
- **Si ahora aparece "Next.js"**: ✅ Perfecto, déjalo así
- **Si sigue apareciendo "Other"**: ⚠️ Continúa con la Opción 2

#### 3️⃣ Build and Output Settings

**Si el Framework está en "Other"**, expande esta sección y configura:

- **Build Command:**
  ```
  npx prisma generate && yarn build
  ```

- **Output Directory:**
  ```
  .next
  ```

- **Install Command:**
  ```
  yarn install
  ```

#### 4️⃣ Environment Variables

Agregar estas variables (haz clic en "Add Another" para cada una):

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | `postgresql://neondb_owner:tu_password@ep-cool-sea-a5jt7r2q-pooler.us-east-2.aws.neon.tech/hotel_pms_production?sslmode=require&pgbouncer=true&connect_timeout=10` |
| `NEXTAUTH_URL` | `https://tu-proyecto.vercel.app` |
| `NEXTAUTH_SECRET` | `aG8t3lP@s30L@sM3rc3d3s!2024#PMS$V3rc3l%S3cr3t&K3y*S3cur3!` |
| `NODE_ENV` | `production` |

**⚠️ IMPORTANTE:**
- Reemplaza `tu_password` con tu contraseña real de Neon
- Después del primer deploy, actualiza `NEXTAUTH_URL` con la URL real que te dé Vercel

---

### Opción 2: Si el Problema Persiste

Si después de reintentar sigue sin detectar Next.js:

1. **Verifica en GitHub** que el archivo `vercel.json` actualizado esté presente:
   - Ve a: https://github.com/mfconsultoresdev/hotel-pms-paseo-las-mercedes/blob/master/vercel.json
   - Confirma que contiene el contenido simplificado

2. **Espera 1-2 minutos** después de hacer el push para que GitHub sincronice

3. **Limpia el caché de Vercel:**
   - Cierra sesión en Vercel
   - Borra las cookies del navegador para vercel.com
   - Vuelve a iniciar sesión

4. **Intenta nuevamente** la importación

---

## 🚀 Después del Deploy

Una vez que Vercel termine el deploy:

### 1. Actualizar NEXTAUTH_URL

```bash
# En Vercel Dashboard → Settings → Environment Variables
# Editar NEXTAUTH_URL con la URL real:
NEXTAUTH_URL=https://hotel-pms-paseo-las-mercedes-[tu-id].vercel.app
```

### 2. Re-deployar

En Vercel Dashboard:
- Ve a la pestaña **"Deployments"**
- Haz clic en los **tres puntos** del último deployment
- Selecciona **"Redeploy"**

---

## 🔍 Verificación del Deploy

Después del deploy, verifica:

1. ✅ **Build exitoso** (sin errores en los logs)
2. ✅ **Página carga correctamente**
3. ✅ **Login funciona**
4. ✅ **Dashboard es accesible**

---

## ❓ Troubleshooting

### Si el build falla con error de Prisma:

Verifica que `DATABASE_URL` esté correctamente configurada en las Environment Variables de Vercel.

### Si el login no funciona:

1. Verifica `NEXTAUTH_SECRET` en Environment Variables
2. Confirma que `NEXTAUTH_URL` tenga la URL correcta
3. Re-deploya después de actualizar las variables

### Si aparece error 500:

Revisa los logs en: Vercel Dashboard → Deployment → Runtime Logs

---

## 📸 Capturas de Referencia

La configuración correcta debe verse así:

- **Root Directory:** `app`
- **Framework Preset:** `Next.js` (o "Other" con build command configurado)
- **Build Command:** `npx prisma generate && yarn build`
- **Output Directory:** `.next`
- **Install Command:** `yarn install`

---

## 📞 Soporte

Si después de estos pasos el problema persiste:
- Toma una captura de pantalla del error específico
- Revisa los logs de build en Vercel
- Verifica que todos los archivos estén correctamente en GitHub

---

**Última actualización:** 1 de octubre de 2025 - 15:30  
**Estado:** Configuración actualizada y subida a GitHub
