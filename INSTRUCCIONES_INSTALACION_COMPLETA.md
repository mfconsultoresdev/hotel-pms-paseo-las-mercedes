# 🚀 INSTRUCCIONES COMPLETAS DE INSTALACIÓN - HOTEL PMS

## 📋 **ESTADO ACTUAL**

✅ **Archivo .env configurado** con credenciales de desarrollo
❌ **PostgreSQL NO instalado** - Requiere instalación
❌ **Node.js NO instalado** - Requiere instalación
❌ **Base de datos NO creada** - Requiere PostgreSQL

---

## 🔧 **PASO 1: INSTALAR POSTGRESQL**

### **Descarga e Instalación:**
1. **Ve a:** https://www.postgresql.org/download/windows/
2. **Descarga:** PostgreSQL 15 o superior para Windows
3. **Ejecuta el instalador** como administrador

### **Configuración Durante la Instalación:**
- **Puerto:** 5432 (por defecto)
- **Contraseña del usuario postgres:** `admin123`
- **Puerto:** 5432
- **Locale:** Default locale
- **Stack Builder:** NO marcar (opcional)

### **Verificar Instalación:**
```bash
# Abre PowerShell y ejecuta:
psql --version
```

---

## 🔧 **PASO 2: INSTALAR NODE.JS**

### **Descarga e Instalación:**
1. **Ve a:** https://nodejs.org/en/download/
2. **Descarga:** Node.js 18 LTS (Long Term Support)
3. **Ejecuta el instalador** como administrador

### **Verificar Instalación:**
```bash
# Abre PowerShell y ejecuta:
node --version
npm --version
```

---

## 🔧 **PASO 3: CREAR BASE DE DATOS**

### **Después de instalar PostgreSQL:**
```bash
# Abre PowerShell y ejecuta:
$env:PGPASSWORD = "admin123"
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE hotel_pms;"
```

### **Verificar Base de Datos:**
```bash
psql -U postgres -h localhost -p 5432 -d hotel_pms -c "SELECT current_database();"
```

---

## 🔧 **PASO 4: CONFIGURAR EL PROYECTO**

### **Instalar Dependencias:**
```bash
# En el directorio del proyecto:
cd C:\Users\Administrador\Desktop\Hotel_PMS\hotel_pms_paseo_las_mercedes\app
npm install
```

### **Generar Cliente Prisma:**
```bash
npx prisma generate
```

### **Crear Esquema de Base de Datos:**
```bash
npx prisma db push
```

### **Insertar Datos Iniciales:**
```bash
npm run prisma:seed
```

---

## 🔧 **PASO 5: INICIAR EL SISTEMA**

### **Modo Desarrollo:**
```bash
npm run dev
```

### **Abrir en Navegador:**
- **URL:** http://localhost:3000
- **Usuario:** admin@hotel.com
- **Contraseña:** admin123

---

## 🔧 **PASO 6: VERIFICAR FUNCIONALIDAD**

### **Script de Prueba:**
```bash
npm run test:db
```

### **APIs Disponibles:**
- **Health Check:** http://localhost:3000/api/monitoring/health
- **Métricas:** http://localhost:3000/api/monitoring/metrics
- **Alertas:** http://localhost:3000/api/monitoring/alerts

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Error: "psql no se reconoce"**
- **Solución:** PostgreSQL no está en el PATH
- **Reinicia PowerShell** después de la instalación
- **O agrega PostgreSQL al PATH del sistema**

### **Error: "node no se reconoce"**
- **Solución:** Node.js no está en el PATH
- **Reinicia PowerShell** después de la instalación
- **O agrega Node.js al PATH del sistema**

### **Error: "Cannot connect to PostgreSQL"**
- **Verifica:** PostgreSQL esté ejecutándose
- **Verifica:** Contraseña sea `admin123`
- **Verifica:** Puerto sea 5432

### **Error: "Database does not exist"**
- **Ejecuta:** `CREATE DATABASE hotel_pms;`
- **Verifica:** Usuario tenga permisos

---

## 📊 **ESTADO DESPUÉS DE LA INSTALACIÓN**

### **✅ COMPLETADO:**
- Archivo .env configurado
- Variables de entorno definidas
- Credenciales de desarrollo establecidas

### **⏳ PENDIENTE:**
- Instalación de PostgreSQL
- Instalación de Node.js
- Creación de base de datos
- Instalación de dependencias
- Generación de cliente Prisma
- Inserción de datos iniciales

---

## 🎯 **RESULTADO FINAL**

Después de completar todos los pasos, tendrás:

- 🏨 **Sistema de gestión hotelera completamente funcional**
- 📊 **Dashboard ejecutivo con métricas en tiempo real**
- 🔒 **Sistema de seguridad robusto**
- 📱 **Interfaz responsive y moderna**
- 🚀 **Arquitectura escalable preparada para producción**
- 📈 **Monitoreo completo y observabilidad**
- ⚡ **Performance optimizada con cache y colas**

---

## 📞 **SOPORTE**

Si encuentras problemas durante la instalación:

1. **Verifica que PostgreSQL esté ejecutándose**
2. **Verifica que Node.js esté instalado correctamente**
3. **Verifica las credenciales en el archivo .env**
4. **Ejecuta los scripts de verificación**

---

**🚀 ¡El sistema está listo para funcionar una vez completada la instalación!**

