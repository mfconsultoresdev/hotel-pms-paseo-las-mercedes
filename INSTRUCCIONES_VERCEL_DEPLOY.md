
# 🚀 Instrucciones para Deploy en Vercel - Hotel PMS

## ⚠️ IMPORTANTE: El proyecto está en el subdirectorio `/app`

El código de Next.js está dentro de la carpeta `app/`, no en la raíz del repositorio.

---

## 📝 Pasos para Configurar en Vercel

### **Paso 1: Importar Proyecto**

1. Ve a https://vercel.com
2. Click en **"Add New Project"**
3. Selecciona el repositorio: **`hotel-pms-paseo-las-mercedes`**
4. Branch: **`master`** (o `clean-deploy` si no cambiaste el branch principal)

---

### **Paso 2: Configurar Root Directory** ⭐ CRÍTICO

En la pantalla de configuración del proyecto:

1. **Framework Preset:** 
   - Si no se detecta automáticamente, selecciona manualmente: **Next.js**

2. **Root Directory:** ⚠️ IMPORTANTE
   - Click en **"Edit"** junto a "Root Directory"
   - Cambiar de `.` (root) a: **`app`**
   - Esto le indica a Vercel que el proyecto Next.js está en `/app`

3. **Build and Output Settings:**
   - **Build Command:** `yarn build` (Vercel lo detectará automáticamente al estar en /app)
   - **Output Directory:** `.next` (por defecto de Next.js)
   - **Install Command:** `yarn install` (por defecto)

---

### **Paso 3: Configurar Variables de Entorno** 🔐

Click en **"Environment Variables"** y agregar:

#### **Variables Obligatorias:**

```env
DATABASE_URL
postgresql://neondb_owner:npg_vYwoRk4e5sLQ@ep-shy-tree-adruv4z1-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

```env
NEXTAUTH_SECRET
[Generar con: openssl rand -base64 32]
Ejemplo: Kx8mP3nQ2rT5wY9zA1bC4dE7fH0iJ6kL8mN9oP2qR5sT8uV1wX4yZ7aB0cD3eF6g
```

```env
NEXTAUTH_URL
https://[tu-proyecto].vercel.app
NOTA: Primero deploy sin esto, luego agregar la URL generada por Vercel
```

#### **Variables de Stripe (si tienes las keys):**

```env
STRIPE_SECRET_KEY
sk_live_TU_CLAVE_SECRETA_AQUI
```

```env
STRIPE_PUBLISHABLE_KEY
pk_live_TU_CLAVE_PUBLICA_AQUI
```

```env
STRIPE_WEBHOOK_SECRET
whsec_TU_WEBHOOK_SECRET_AQUI
(Este se configura después del primer deploy)
```

#### **Variables Opcionales:**

```env
NEXT_PUBLIC_APP_URL
https://[tu-proyecto].vercel.app
```

---

### **Paso 4: Deploy Inicial**

1. Click en **"Deploy"**
2. Vercel comenzará a construir el proyecto
3. Espera a que termine (puede tomar 5-10 minutos)

**Durante el build, Vercel ejecutará:**
- `yarn install` (instalar dependencias)
- `npx prisma generate` (generar Prisma Client)
- `yarn build` (construir Next.js)

---

### **Paso 5: Después del Primer Deploy**

Una vez que el deploy termine:

1. **Obtener la URL de Vercel:**
   - Ejemplo: `https://hotel-pms-paseo-las-mercedes.vercel.app`

2. **Actualizar Variable de Entorno:**
   - Ve a Project Settings → Environment Variables
   - Edita `NEXTAUTH_URL` con la URL real
   - Click en **"Redeploy"**

3. **Migrar Base de Datos (Primera vez):**
   - Ve a Project Settings → Functions
   - En la terminal de Vercel, ejecutar:
     ```bash
     npx prisma db push
     ```
   - O desde tu computadora:
     ```bash
     cd app
     DATABASE_URL="tu-connection-string-neon" npx prisma db push
     ```

4. **Seed de Datos Iniciales (Opcional):**
   - Ejecutar los scripts de seed para crear datos de prueba
   - Crear usuario administrador inicial

---

## ✅ Checklist de Verificación

Antes de hacer deploy, verifica:

- [ ] Root Directory configurado como **`app`**
- [ ] Framework Preset: **Next.js**
- [ ] Variable `DATABASE_URL` agregada
- [ ] Variable `NEXTAUTH_SECRET` generada y agregada
- [ ] Branch seleccionado: **`master`** o **`clean-deploy`**

Después del primer deploy:

- [ ] `NEXTAUTH_URL` actualizado con URL de Vercel
- [ ] Prisma migrations aplicadas
- [ ] Datos iniciales creados (seed)
- [ ] Login funciona correctamente
- [ ] Stripe configurado (si aplica)

---

## 🐛 Solución de Problemas Comunes

### **Error: "No Framework Detected"**
**Solución:** Configurar Root Directory como `app` (ver Paso 2)

### **Error: "Cannot find module '@prisma/client'"**
**Solución:** Agregar build command:
```
cd app && npx prisma generate && yarn build
```

### **Error: "Invalid Environment Variables"**
**Solución:** Verificar que `DATABASE_URL` esté bien formateado (sin espacios ni saltos de línea)

### **Error: "NextAuth URL Missing"**
**Solución:** 
1. Deploy sin `NEXTAUTH_URL` primero
2. Agregar la URL después del primer deploy
3. Redeploy

### **Error de Build: "Module not found"**
**Solución:** 
- Verificar que todas las dependencias estén en `package.json`
- Ejecutar localmente: `cd app && yarn install`

---

## 📞 Información de Contacto

### Repositorio GitHub
- **URL:** https://github.com/mfconsultoresdev/hotel-pms-paseo-las-mercedes
- **Branch:** master (o clean-deploy)

### Base de Datos Neon
- **Host:** ep-shy-tree-adruv4z1-pooler.c-2.us-east-1.aws.neon.tech
- **Database:** neondb
- **Region:** US East

---

## 🎯 Próximos Pasos Después del Deploy

1. **Configurar Custom Domain** (opcional)
2. **Setup Stripe Webhooks** (si usas pagos)
3. **Configurar Email Service** (para notificaciones)
4. **Monitoreo y Analytics**
5. **Backups automáticos** (Neon ya incluye esto)

---

**Fecha:** 1 de octubre, 2025  
**Estado:** ✅ Listo para deploy  
**Estructura:** Proyecto en subdirectorio `/app`
