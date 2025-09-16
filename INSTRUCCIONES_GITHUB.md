# 📚 INSTRUCCIONES PARA CREAR REPOSITORIO EN GITHUB

## 🚀 **PASOS PARA SUBIR EL PROYECTO A GITHUB**

### **1. Crear Repositorio en GitHub**
1. Ve a [GitHub.com](https://github.com)
2. Haz clic en **"New repository"** o **"+"** → **"New repository"**
3. Configura el repositorio:
   - **Repository name**: `hotel-pms-paseo-las-mercedes`
   - **Description**: `Complete Hotel Property Management System - Next.js 14, TypeScript, Supabase`
   - **Visibility**: `Public` o `Private` (según prefieras)
   - **NO marcar**: "Add a README file" (ya tenemos uno)
   - **NO marcar**: "Add .gitignore" (ya tenemos uno)
   - **NO marcar**: "Choose a license" (opcional)

### **2. Conectar Repositorio Local con GitHub**
```bash
# Agregar el repositorio remoto (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/hotel-pms-paseo-las-mercedes.git

# Cambiar nombre de la rama principal a 'main'
git branch -M main

# Subir el código a GitHub
git push -u origin main
```

### **3. Verificar la Subida**
1. Ve a tu repositorio en GitHub
2. Verifica que todos los archivos estén presentes
3. Verifica que el README.md se muestre correctamente

---

## 🔧 **COMANDOS ALTERNATIVOS**

### **Si usas SSH en lugar de HTTPS:**
```bash
git remote add origin git@github.com:TU_USUARIO/hotel-pms-paseo-las-mercedes.git
git branch -M main
git push -u origin main
```

### **Si necesitas autenticación:**
```bash
# Para HTTPS con token personal
git remote add origin https://TU_TOKEN@github.com/TU_USUARIO/hotel-pms-paseo-las-mercedes.git

# Para SSH (necesitas configurar SSH keys)
git remote add origin git@github.com:TU_USUARIO/hotel-pms-paseo-las-mercedes.git
```

---

## 📋 **ESTRUCTURA DEL REPOSITORIO**

Tu repositorio incluirá:

```
hotel-pms-paseo-las-mercedes/
├── 📁 app/                    # Aplicación Next.js
│   ├── 📁 components/         # Componentes React
│   ├── 📁 lib/               # Utilidades
│   ├── 📁 prisma/            # Esquema de base de datos
│   ├── 📁 scripts/           # Scripts de utilidad
│   ├── 📁 types/             # Tipos TypeScript
│   └── 📄 README.md          # Documentación principal
├── 📄 GUIA_DEPLOYMENT_COMPLETA.md
├── 📄 VERIFICACION_COMPLETA_SUPABASE.md
└── 📄 INSTRUCCIONES_GITHUB.md
```

---

## 🎯 **DESPUÉS DE SUBIR EL REPOSITORIO**

### **1. Configurar GitHub Pages (Opcional)**
- Ve a **Settings** → **Pages**
- Selecciona **"Deploy from a branch"**
- Elige la rama **main**

### **2. Configurar Secrets para Deployment**
Ve a **Settings** → **Secrets and variables** → **Actions** y agrega:
```
DATABASE_URL=postgresql://postgres:fKntFJ1EoPwZHdOV@db.mwfzdcfgzdhlravjzanf.supabase.co:5432/postgres
NEXTAUTH_SECRET=TIqNngAAcHOVduGS72Y+otkifhYFr/4lA0RZlBE8xH4=
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://mwfzdcfgzdhlravjzanf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **3. Configurar Vercel (Recomendado)**
1. Ve a [Vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa el repositorio
4. Configura las variables de entorno
5. Deploy automático

---

## ✅ **VERIFICACIÓN FINAL**

Después de subir el repositorio, verifica:

- ✅ **202 archivos** subidos correctamente
- ✅ **README.md** se muestra en GitHub
- ✅ **Estructura de carpetas** correcta
- ✅ **Archivos de configuración** presentes
- ✅ **Scripts de deployment** incluidos

---

## 🚀 **PRÓXIMOS PASOS**

1. **Deploy en Vercel**: Conectar repositorio y deploy automático
2. **Configurar dominio**: Dominio personalizado para producción
3. **Setup monitoreo**: Analytics y error tracking
4. **Testing**: Pruebas en ambiente de producción

---

**¡Tu Hotel PMS estará disponible en GitHub y listo para deployment!** 🎉
