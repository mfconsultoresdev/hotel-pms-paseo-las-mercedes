# 🚀 GUÍA COMPLETA: DEPLOY EN VERCEL + SUPABASE CON GITHUB

## 📋 **RESUMEN RÁPIDO**
- **Vercel**: Hosting gratuito para tu aplicación Next.js
- **Supabase**: Base de datos PostgreSQL gratuita
- **GitHub**: Control de versiones y CI/CD automático
- **Costo total**: $0/mes (100% gratuito)

---

## 🗄️ **PASO 1: CONFIGURAR SUPABASE (BASE DE DATOS)**

### **1.1 Crear cuenta en Supabase**
1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Start your project"
3. Selecciona "Continue with GitHub"
4. Autoriza la aplicación
5. Verifica tu email

### **1.2 Crear nuevo proyecto**
1. Haz clic en "New Project"
2. Selecciona tu organización
3. **Nombre del proyecto**: `hotel-pms-production`
4. **Contraseña de base de datos**: Crea una contraseña segura y **ANÓTALA**
5. **Región**: Selecciona la más cercana a tus usuarios
6. Haz clic en "Create new project"
7. **Espera 2-3 minutos** a que se cree

### **1.3 Obtener credenciales de conexión**
1. Ve a **Settings** → **Database**
2. **ANOTA TODAS ESTAS CREDENCIALES:**
   - **Host**: `db.[TU-PROJECT-REF].supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **User**: `postgres`
   - **Connection string**: `postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres`
   - **Project Reference**: Para las URLs de la API

---

## 🚀 **PASO 2: CONFIGURAR VERCEL (HOSTING)**

### **2.1 Crear cuenta en Vercel**
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Continue with GitHub"
3. Autoriza la aplicación
4. Verifica tu email

### **2.2 Crear nuevo proyecto**
1. Haz clic en "New Project"
2. Selecciona tu repositorio de GitHub: `hotel_pms_paseo_las_mercedes`
3. Vercel detectará automáticamente que es Next.js
4. **ANOTA**: El nombre de la aplicación (ej: `hotel-pms-abc123`)
5. Haz clic en "Deploy"

### **2.3 Primer deploy (puede fallar)**
- Espera a que termine el deploy
- Si falla, **NO TE PREOCUPES** (es normal sin variables de entorno)
- Anota la URL de la aplicación (ej: `https://hotel-pms-abc123.vercel.app`)

---

## ⚙️ **PASO 3: CONFIGURAR VARIABLES DE ENTORNO EN VERCEL**

### **3.1 Ir a Environment Variables**
1. En Vercel Dashboard → Tu proyecto
2. Ve a **Settings** → **Environment Variables**
3. Agrega las variables **UNA POR UNA**

### **3.2 Variables obligatorias (agregar en Production)**
```
DATABASE_URL
postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres

NEXTAUTH_SECRET
hotel_pms_2024_production_secret_key_secure_32

JWT_SECRET
hotel_pms_jwt_production_secret_2024_secure_key

NEXTAUTH_URL
https://[TU-APP-NAME].vercel.app

NODE_ENV
production

NEXT_PUBLIC_APP_URL
https://[TU-APP-NAME].vercel.app

PRISMA_GENERATE_DATAPROXY
true
```

### **3.3 Variables opcionales del hotel**
```
HOTEL_NAME
Hotel Paseo Las Mercedes

HOTEL_ADDRESS
Dirección del Hotel

HOTEL_PHONE
+1234567890

HOTEL_EMAIL
info@hotel.com

HOTEL_CURRENCY
USD

HOTEL_TIMEZONE
America/Caracas
```

---

## 🔄 **PASO 4: REDEPLOY Y VERIFICACIÓN**

### **4.1 Hacer redeploy**
1. Después de agregar todas las variables
2. En Vercel Dashboard → **Deployments**
3. Haz clic en **"Redeploy"** en el último deployment
4. Espera a que termine el build

### **4.2 Verificar build exitoso**
- ✅ Build completado sin errores
- ✅ Cliente Prisma generado
- ✅ Variables de entorno cargadas
- ✅ Aplicación desplegada

### **4.3 Verificar funcionalidad**
- ✅ Aplicación accesible en la URL
- ✅ Página principal carga correctamente
- ✅ No hay errores en la consola del navegador
- ✅ API routes responden

---

## 🗄️ **PASO 5: CONFIGURAR BASE DE DATOS**

### **5.1 Ejecutar migraciones Prisma**
1. En Supabase → **SQL Editor**
2. Ejecuta: `npx prisma db push` (desde Vercel)
3. Verifica que las tablas se crearon

### **5.2 Verificar conexión**
- ✅ Base de datos accesible desde Vercel
- ✅ Tablas creadas correctamente
- ✅ Prisma puede conectarse

---

## 🎯 **PASO 6: CONFIGURACIÓN FINAL**

### **6.1 Dominio personalizado (opcional)**
1. En Vercel → **Settings** → **Domains**
2. Agrega dominio personalizado si lo tienes
3. Configura DNS según instrucciones

### **6.2 Monitoreo (opcional)**
- Configurar Sentry si quieres monitoreo
- Configurar analytics si los necesitas

---

## 🆘 **SOLUCIÓN DE PROBLEMAS COMUNES**

### **Error: "Build Failed"**
**Solución:**
1. Verifica que todas las variables estén configuradas
2. Revisa logs de build en Vercel
3. Verifica que `package.json` tenga los scripts correctos
4. Ejecuta `npm run build` localmente para verificar

### **Error: "Database Connection Failed"**
**Solución:**
1. Verifica DATABASE_URL en Vercel
2. Verifica que Supabase esté activo
3. Verifica políticas de firewall
4. Asegúrate de que la contraseña sea correcta

### **Error: "Prisma Client not generated"**
**Solución:**
1. Verifica que `PRISMA_GENERATE_DATAPROXY=true`
2. Verifica que `postinstall` script esté en package.json
3. Haz redeploy después de cambiar variables

### **Error: "Environment Variables Missing"**
**Solución:**
1. Configura todas las variables requeridas en Vercel
2. Verifica que los nombres coincidan exactamente
3. Reinicia el deploy después de cambiar variables

---

## 📱 **CONFIGURACIÓN DE GITHUB (CI/CD)**

### **3.1 Verificar repositorio**
1. Asegúrate de que tu código esté en GitHub
2. Verifica que la rama principal sea `main` o `master`
3. Haz push de los últimos cambios:
```bash
git add .
git commit -m "Preparar para deploy en Vercel"
git push origin main
```

### **3.2 Deploy automático**
- Vercel se conectará automáticamente a GitHub
- Cada vez que hagas push a `main`, se hará deploy automático
- Puedes ver el estado en el dashboard de Vercel

---

## 🔒 **CONFIGURACIÓN DE SEGURIDAD**

### **4.1 Variables sensibles**
- **NUNCA** subas `.env` a GitHub
- Usa `.gitignore` para excluir archivos sensibles
- Todas las variables sensibles van en Vercel

### **4.2 Base de datos**
- Supabase tiene políticas de seguridad por defecto
- Configura Row Level Security (RLS) si es necesario
- Usa usuarios con permisos limitados

---

## 📊 **MONITOREO Y MANTENIMIENTO**

### **5.1 Logs de Vercel**
- Revisa logs en **Functions** → **Logs**
- Monitorea el rendimiento en **Analytics**

### **5.2 Base de datos Supabase**
- Monitorea uso en **Dashboard**
- Revisa logs en **Logs**
- Configura alertas si es necesario

---

## 🎉 **¡DEPLOY COMPLETADO!**

Una vez que completes todos los pasos:
- ✅ Tu Hotel PMS estará funcionando en la nube
- ✅ Accesible desde internet 24/7
- ✅ Base de datos PostgreSQL funcionando
- ✅ Autenticación configurada
- ✅ Deploy automático desde GitHub
- ✅ Todo gratis (Vercel + Supabase)

---

## 📞 **SOPORTE Y RECURSOS**

### **Documentación oficial:**
- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

### **Si encuentras problemas:**
1. Revisa los logs de build en Vercel
2. Verifica las variables de entorno
3. Asegúrate de que Supabase esté activo
4. Revisa la documentación oficial

---

## 🚀 **TIEMPO ESTIMADO: 30-45 MINUTOS**

**¡Tu Hotel PMS estará funcionando en la nube en menos de una hora!**

---

## 📋 **CHECKLIST FINAL**

- [ ] ✅ Cuenta creada en Supabase
- [ ] ✅ Proyecto creado en Supabase
- [ ] ✅ Credenciales de base de datos anotadas
- [ ] ✅ Cuenta creada en Vercel
- [ ] ✅ Proyecto conectado a GitHub
- [ ] ✅ Primer deploy realizado
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Redeploy exitoso
- [ ] ✅ Base de datos conectada
- [ ] ✅ Aplicación funcionando
- [ ] ✅ Dominio personalizado configurado (opcional)

**🎯 ¡Todo listo para usar tu Hotel PMS en producción!**
