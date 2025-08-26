# 🚀 CHECKLIST COMPLETO - DEPLOY EN VERCEL CON SUPABASE

## 📋 **PREPARACIÓN DEL PROYECTO (YA COMPLETADO)**

- [x] ✅ Proyecto compila localmente (`npm run build`)
- [x] ✅ Cliente Prisma configurado correctamente
- [x] ✅ Archivo `vercel.json` creado
- [x] ✅ `next.config.js` optimizado
- [x] ✅ Scripts de deploy agregados a `package.json`
- [x] ✅ Repositorio en GitHub

---

## 🗄️ **PASO 1: CONFIGURAR SUPABASE**

### **1.1 Crear cuenta en Supabase**
- [ ] Ir a [supabase.com](https://supabase.com)
- [ ] Crear cuenta con GitHub
- [ ] Verificar email

### **1.2 Crear nuevo proyecto**
- [ ] Click en "New Project"
- [ ] Seleccionar organización
- [ ] Nombre del proyecto: `hotel-pms-production`
- [ ] Contraseña de base de datos: **ANOTAR ESTA CONTRASEÑA**
- [ ] Región: Seleccionar la más cercana
- [ ] Click en "Create new project"

### **1.3 Obtener credenciales**
- [ ] Esperar que el proyecto se cree (2-3 minutos)
- [ ] Ir a Settings → Database
- [ ] **ANOTAR:** `Host`, `Database name`, `Port`, `User`
- [ ] **ANOTAR:** `Connection string` (DATABASE_URL)
- [ ] **ANOTAR:** `Project Reference` (para las URLs)

---

## 🚀 **PASO 2: CONFIGURAR VERCEL**

### **2.1 Crear cuenta en Vercel**
- [ ] Ir a [vercel.com](https://vercel.com)
- [ ] Crear cuenta con GitHub
- [ ] Verificar email

### **2.2 Crear nuevo proyecto**
- [ ] Click en "New Project"
- [ ] Importar repositorio de GitHub
- [ ] Seleccionar `hotel_pms_paseo_las_mercedes`
- [ ] Vercel detectará Next.js automáticamente
- [ ] **ANOTAR:** Nombre de la aplicación (ej: `hotel-pms-abc123`)
- [ ] Click en "Deploy"

### **2.3 Primer deploy (puede fallar)**
- [ ] Esperar que termine el deploy
- [ ] Si falla, no te preocupes (es normal sin variables de entorno)
- [ ] Anotar la URL de la aplicación

---

## ⚙️ **PASO 3: CONFIGURAR VARIABLES DE ENTORNO**

### **3.1 Ir a Environment Variables**
- [ ] En Vercel Dashboard → Tu proyecto
- [ ] Settings → Environment Variables
- [ ] Agregar variables una por una

### **3.2 Variables obligatorias (agregar en Production)**
- [ ] **DATABASE_URL**
  ```
  postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres
  ```
- [ ] **NEXTAUTH_SECRET**
  ```
  hotel_pms_2024_production_secret_key_secure_32
  ```
- [ ] **JWT_SECRET**
  ```
  hotel_pms_jwt_production_secret_2024_secure_key
  ```
- [ ] **NEXTAUTH_URL**
  ```
  https://[TU-APP-NAME].vercel.app
  ```
- [ ] **NODE_ENV**
  ```
  production
  ```
- [ ] **NEXT_PUBLIC_APP_URL**
  ```
  https://[TU-APP-NAME].vercel.app
  ```
- [ ] **PRISMA_GENERATE_DATAPROXY**
  ```
  true
  ```

### **3.3 Variables opcionales del hotel**
- [ ] **HOTEL_NAME**
  ```
  Hotel Paseo Las Mercedes
  ```
- [ ] **HOTEL_ADDRESS**
  ```
  Dirección del Hotel
  ```
- [ ] **HOTEL_PHONE**
  ```
  +1234567890
  ```
- [ ] **HOTEL_EMAIL**
  ```
  info@hotel.com
  ```
- [ ] **HOTEL_CURRENCY**
  ```
  USD
  ```
- [ ] **HOTEL_TIMEZONE**
  ```
  America/Caracas
  ```

---

## 🔄 **PASO 4: REDEPLOY Y VERIFICACIÓN**

### **4.1 Hacer redeploy**
- [ ] Después de agregar todas las variables
- [ ] En Vercel Dashboard → Deployments
- [ ] Click en "Redeploy" en el último deployment
- [ ] Esperar que termine el build

### **4.2 Verificar build exitoso**
- [ ] ✅ Build completado sin errores
- [ ] ✅ Cliente Prisma generado
- [ ] ✅ Variables de entorno cargadas
- [ ] ✅ Aplicación desplegada

### **4.3 Verificar funcionalidad**
- [ ] ✅ Aplicación accesible en la URL
- [ ] ✅ Página principal carga correctamente
- [ ] ✅ No hay errores en la consola del navegador
- [ ] ✅ API routes responden (si las hay)

---

## 🗄️ **PASO 5: CONFIGURAR BASE DE DATOS**

### **5.1 Ejecutar migraciones Prisma**
- [ ] En Supabase → SQL Editor
- [ ] Ejecutar: `npx prisma db push` (desde Vercel)
- [ ] Verificar que las tablas se crearon

### **5.2 Verificar conexión**
- [ ] ✅ Base de datos accesible desde Vercel
- [ ] ✅ Tablas creadas correctamente
- [ ] ✅ Prisma puede conectarse

---

## 🎯 **PASO 6: CONFIGURACIÓN FINAL**

### **6.1 Dominio personalizado (opcional)**
- [ ] En Vercel → Settings → Domains
- [ ] Agregar dominio personalizado si lo tienes
- [ ] Configurar DNS según instrucciones

### **6.2 Monitoreo (opcional)**
- [ ] Configurar Sentry si quieres monitoreo
- [ ] Configurar analytics si los necesitas

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Build Failed"**
- [ ] Verificar que todas las variables estén configuradas
- [ ] Revisar logs de build en Vercel
- [ ] Verificar que `package.json` tenga los scripts correctos

### **Error: "Database Connection Failed"**
- [ ] Verificar DATABASE_URL en Vercel
- [ ] Verificar que Supabase esté activo
- [ ] Verificar políticas de firewall

### **Error: "Prisma Client not generated"**
- [ ] Verificar que `PRISMA_GENERATE_DATAPROXY=true`
- [ ] Verificar que `postinstall` script esté en package.json

---

## 🎉 **¡DEPLOY COMPLETADO!**

Una vez que completes todos los pasos:
- ✅ Tu Hotel PMS estará funcionando en la nube
- ✅ Accesible desde internet 24/7
- ✅ Base de datos PostgreSQL funcionando
- ✅ Autenticación configurada
- ✅ Todo gratis (Vercel + Supabase)

---

## 📞 **SOPORTE**

Si encuentras problemas:
1. Revisa los logs de build en Vercel
2. Verifica las variables de entorno
3. Asegúrate de que Supabase esté activo
4. Revisa la documentación de Vercel y Supabase

**🚀 ¡Tu Hotel PMS estará funcionando en la nube en menos de 30 minutos!**
