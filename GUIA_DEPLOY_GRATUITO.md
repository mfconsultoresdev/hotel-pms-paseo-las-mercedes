# 🚀 GUÍA COMPLETA DE DEPLOY GRATUITO - HOTEL PMS

## 📋 **RESUMEN DE OPCIONES GRATUITAS:**

| **Plataforma** | **Gratis** | **Base de Datos** | **Dificultad** | **Recomendación** |
|----------------|------------|-------------------|----------------|-------------------|
| **Vercel** | ✅ Sí | ❌ No incluida | 🟢 Fácil | 🥇 **RECOMENDADA** |
| **Railway** | ✅ Sí | ✅ PostgreSQL | 🟡 Media | 🥈 **Alternativa** |
| **Netlify** | ✅ Sí | ❌ No incluida | 🟢 Fácil | 🥉 **Opción** |

---

## 🥇 **OPCIÓN 1: VERCEL (RECOMENDADA)**

### **Ventajas:**
- ✅ **100% gratuito** para proyectos personales
- ✅ **Integración nativa** con Next.js
- ✅ **CI/CD automático** desde GitHub
- ✅ **100GB de ancho de banda** por mes
- ✅ **100 funciones serverless** por mes
- ✅ **SSL automático** y CDN global

### **Limitaciones:**
- ❌ **No incluye base de datos** PostgreSQL
- ❌ **Funciones serverless** tienen timeout de 10 segundos
- ❌ **Ancho de banda limitado** a 100GB/mes

### **Pasos para Deploy:**

#### **1. Preparar el Proyecto:**
```bash
# En tu directorio local
npm run build
git add .
git commit -m "Preparar para deploy en Vercel"
git push origin main
```

#### **2. Crear Cuenta en Vercel:**
1. Ve a [vercel.com](https://vercel.com)
2. Crea cuenta con GitHub
3. Haz clic en "New Project"

#### **3. Conectar Repositorio:**
1. Selecciona tu repositorio de GitHub
2. Vercel detectará automáticamente que es Next.js
3. Haz clic en "Deploy"

#### **4. Configurar Variables de Entorno:**
En el dashboard de Vercel, ve a Settings > Environment Variables:
```
DATABASE_URL=postgresql://user:pass@host:port/db
NEXTAUTH_SECRET=tu_secret_aqui
NEXTAUTH_URL=https://tu-app.vercel.app
JWT_SECRET=tu_jwt_secret_aqui
NODE_ENV=production
```

#### **5. Base de Datos Gratuita:**
Para PostgreSQL gratuito, usa:
- **Supabase** (500MB gratis)
- **Neon** (3GB gratis)
- **Railway** ($5 créditos gratis/mes)

---

## 🥈 **OPCIÓN 2: RAILWAY (CON BASE DE DATOS)**

### **Ventajas:**
- ✅ **$5 de créditos gratis** por mes
- ✅ **PostgreSQL incluido** en el mismo proyecto
- ✅ **Redis incluido** para cache
- ✅ **Deploy automático** desde GitHub
- ✅ **SSL automático** y dominio personalizado

### **Limitaciones:**
- ❌ **Créditos limitados** ($5/mes)
- ❌ **Puede ser más costoso** si excedes los créditos
- ❌ **Configuración más compleja**

### **Pasos para Deploy:**

#### **1. Crear Cuenta en Railway:**
1. Ve a [railway.app](https://railway.app)
2. Crea cuenta con GitHub
3. Haz clic en "Start a New Project"

#### **2. Crear Base de Datos:**
1. Selecciona "Provision PostgreSQL"
2. Anota las credenciales de conexión
3. Copia la DATABASE_URL

#### **3. Deploy de la Aplicación:**
1. Selecciona "Deploy from GitHub repo"
2. Selecciona tu repositorio
3. Railway detectará Next.js automáticamente

#### **4. Configurar Variables:**
En Railway, ve a Variables:
```
DATABASE_URL=postgresql://user:pass@host:port/db
NEXTAUTH_SECRET=tu_secret_aqui
NEXTAUTH_URL=https://tu-app.railway.app
JWT_SECRET=tu_jwt_secret_aqui
NODE_ENV=production
```

---

## 🥉 **OPCIÓN 3: NETLIFY**

### **Ventajas:**
- ✅ **100% gratuito** para proyectos personales
- ✅ **100GB de ancho de banda** por mes
- ✅ **SSL automático** y CDN global
- ✅ **Formularios gratuitos** (100 submissions/mes)

### **Limitaciones:**
- ❌ **No incluye base de datos**
- ❌ **No soporta API routes** de Next.js
- ❌ **Solo para aplicaciones estáticas**

---

## 🔧 **PREPARACIÓN TÉCNICA:**

### **1. Verificar Build Local:**
```bash
# En tu directorio app/
npm run build
```

### **2. Verificar Variables de Entorno:**
Copia `env.production.example` a `.env.local` y configura:
- Base de datos PostgreSQL
- Secrets de autenticación
- URLs de producción

### **3. Verificar Dependencias:**
```bash
npm install --legacy-peer-deps
npx prisma generate
```

---

## 📊 **COSTOS ESTIMADOS:**

### **Vercel + Supabase:**
- **Vercel:** $0/mes
- **Supabase:** $0/mes (500MB)
- **Total:** $0/mes

### **Railway:**
- **Aplicación + DB:** $0/mes (dentro de $5 créditos)
- **Si excedes:** ~$5-15/mes

### **Netlify + Supabase:**
- **Netlify:** $0/mes
- **Supabase:** $0/mes (500MB)
- **Total:** $0/mes

---

## 🚀 **RECOMENDACIÓN FINAL:**

### **Para Pruebas y Desarrollo:**
1. **Vercel** para la aplicación web
2. **Supabase** para la base de datos
3. **Total:** $0/mes

### **Para Producción Real:**
1. **Railway** para todo (app + DB)
2. **Costo:** $5-15/mes
3. **Ventaja:** Todo en una plataforma

---

## 📋 **CHECKLIST DE DEPLOY:**

- [ ] ✅ Proyecto compila localmente (`npm run build`)
- [ ] ✅ Cliente Prisma generado (`npx prisma generate`)
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Repositorio en GitHub
- [ ] ✅ Cuenta creada en plataforma de deploy
- [ ] ✅ Base de datos PostgreSQL configurada
- [ ] ✅ Variables de entorno configuradas en la plataforma
- [ ] ✅ Deploy automático configurado
- [ ] ✅ Dominio personalizado configurado (opcional)
- [ ] ✅ SSL/HTTPS funcionando
- [ ] ✅ Aplicación accesible desde internet

---

## 🆘 **SOLUCIÓN DE PROBLEMAS:**

### **Error: "Build Failed"**
- Verifica que `npm run build` funcione localmente
- Revisa los logs de build en la plataforma
- Verifica las variables de entorno

### **Error: "Database Connection Failed"**
- Verifica que la DATABASE_URL sea correcta
- Asegúrate de que la base de datos esté accesible desde internet
- Verifica que el usuario tenga permisos

### **Error: "Environment Variables Missing"**
- Configura todas las variables requeridas en la plataforma
- Verifica que los nombres coincidan exactamente
- Reinicia el deploy después de cambiar variables

---

**🚀 ¡Con esta guía tendrás tu Hotel PMS funcionando en la nube de forma gratuita!**

