
# 🏨 Hotel PMS "Paseo Las Mercedes" - Guía de Instalación para Cursor en Windows

## 📋 Resumen del Sistema

Este es un **Sistema de Gestión Hotelera (PMS) completo** desarrollado con Next.js 14, TypeScript, PostgreSQL y Prisma ORM. El sistema incluye **7 módulos completamente funcionales** con más de 23 páginas y 60+ APIs.

### ✨ Características Principales
- **Gestión completa de habitaciones** y tipos
- **Sistema de reservaciones** avanzado
- **Check-in/Check-out** automatizado
- **Facturación y pagos** con Stripe
- **Módulo de Housekeeping** con métricas
- **Sistema de reportes** y analytics
- **Comunicaciones** internas y con huéspedes
- **Portal del huésped**

---

## 🖥️ Requisitos del Sistema Windows

### Software Requerido

#### 1. **Node.js** (Versión 18 o superior)
- **Descargar**: https://nodejs.org/
- **Versión recomendada**: Node.js 20.x LTS
- **Verificar instalación**: 
  ```cmd
  node --version
  npm --version
  ```

#### 2. **Yarn** (Gestor de paquetes)
- **Instalar después de Node.js**:
  ```cmd
  npm install -g yarn
  ```
- **Verificar**: `yarn --version`

#### 3. **PostgreSQL** (Base de datos)
- **Descargar**: https://www.postgresql.org/download/windows/
- **Versión recomendada**: PostgreSQL 15 o superior
- **Durante la instalación**:
  - Usuario: `postgres`
  - Contraseña: (elige una contraseña segura)
  - Puerto: `5432` (por defecto)

#### 4. **Cursor IDE**
- **Descargar**: https://cursor.sh/
- **Extensiones recomendadas**:
  - TypeScript and JavaScript Language Features
  - Prisma (para archivos .prisma)
  - Tailwind CSS IntelliSense

#### 5. **Git** (Control de versiones)
- **Descargar**: https://git-scm.com/download/win

---

## 📦 Instalación Paso a Paso

### **PASO 1: Preparar la Base de Datos**

#### 1.1 Crear Base de Datos
Abrir **pgAdmin 4** o **SQL Shell (psql)** y ejecutar:
```sql
-- Crear base de datos
CREATE DATABASE hotel_pms;

-- Crear usuario (opcional)
CREATE USER hotel_admin WITH ENCRYPTED PASSWORD 'hotel123';

-- Dar permisos
GRANT ALL PRIVILEGES ON DATABASE hotel_pms TO hotel_admin;
```

#### 1.2 Aplicar Migración
- Navegar al directorio `database/` del respaldo
- Abrir **SQL Shell (psql)** o **pgAdmin 4**
- Conectar a la base de datos `hotel_pms`
- Ejecutar el archivo de migración:
```bash
# En psql:
\c hotel_pms;
\i hotel_pms_database_migration.sql
```

**O usando pgAdmin 4**:
1. Click derecho en la base de datos `hotel_pms`
2. "Query Tool"
3. Abrir archivo `hotel_pms_database_migration.sql`
4. Ejecutar (F5)

### **PASO 2: Configurar el Proyecto**

#### 2.1 Extraer y Abrir en Cursor
1. **Extraer** el archivo ZIP del respaldo
2. **Abrir Cursor**
3. **File** → **Open Folder** → Seleccionar carpeta `src/`

#### 2.2 Configurar Variables de Entorno
1. En la carpeta `src/`, renombrar `.env.example` a `.env`
2. Editar `.env` con tus configuraciones:
```env
# Configuración de Base de Datos
DATABASE_URL="postgresql://hotel_admin:hotel123@localhost:5432/hotel_pms"

# NextAuth (generar secret: https://generate-secret.vercel.app/32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-clave-secreta-de-32-caracteres-aqui"

# Stripe (opcional - solo si necesitas pagos)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### 2.3 Instalar Dependencias
En la **Terminal de Cursor** (Ctrl + `):
```bash
# Instalar todas las dependencias
yarn install

# Generar cliente de Prisma
npx prisma generate

# Verificar conexión a la base de datos
npx prisma db pull
```

### **PASO 3: Población de Datos de Prueba**

#### 3.1 Ejecutar Seeds
```bash
# Ejecutar script de población (incluido en el proyecto)
yarn tsx scripts/seed.ts
```

#### 3.2 Crear Usuario Admin (si no existe)
```sql
-- Ejecutar en pgAdmin o psql
INSERT INTO "User" (id, email, password, name, role)
VALUES (
    'admin-001',
    'admin@hotelpaseolm.com',
    '$2b$10$example.hash.here',  -- Contraseña: admin123
    'Administrador',
    'ADMIN'
);
```

### **PASO 4: Ejecutar la Aplicación**

#### 4.1 Modo Desarrollo
```bash
# Iniciar servidor de desarrollo
yarn dev
```
✅ **La aplicación estará disponible en**: `http://localhost:3000`

#### 4.2 Modo Producción
```bash
# Construir para producción
yarn build

# Iniciar en producción
yarn start
```

---

## 🔧 Comandos Útiles de Desarrollo

### **Base de Datos**
```bash
# Ver estado de la base de datos
npx prisma studio          # Interfaz web para ver datos

# Resetear base de datos
npx prisma migrate reset    # ⚠️ Borra todos los datos

# Aplicar cambios del schema
npx prisma db push

# Generar cliente después de cambios
npx prisma generate
```

### **Desarrollo**
```bash
# Ejecutar en modo desarrollo
yarn dev

# Verificar tipos TypeScript
yarn tsc --noEmit

# Construir para producción
yarn build

# Ejecutar tests (si están configurados)
yarn test
```

### **Linting y Formato**
```bash
# Verificar código
yarn lint

# Auto-formatear código
yarn lint --fix
```

---

## 🌐 Acceso al Sistema

### **URL Local**
`http://localhost:3000`

### **Credenciales de Prueba**
```
Admin:     admin@hotelpaseolm.com / admin123
Gerente:   gerente@hotelpaseolm.com / admin123  
Recepción: recepcion@hotelpaseolm.com / admin123
```

### **Páginas Principales Disponibles**
- `/dashboard` - Dashboard principal
- `/rooms` - Gestión de habitaciones
- `/reservations` - Sistema de reservas
- `/guests` - Gestión de huéspedes
- `/checkin` - Check-in de huéspedes
- `/checkout` - Check-out de huéspedes
- `/billing` - Facturación y pagos
- `/housekeeping` - Módulo de limpieza
- `/reports` - Reportes y analytics
- `/staff` - Gestión de personal
- `/communications` - Centro de comunicaciones
- `/guest-portal` - Portal del huésped

---

## 🛠️ Solución de Problemas Comunes

### **Error de Conexión a Base de Datos**
```bash
# Verificar que PostgreSQL esté ejecutándose
# Windows: Servicios → PostgreSQL

# Verificar conexión
npx prisma db pull
```

**Solución**:
1. Verificar que PostgreSQL esté iniciado
2. Verificar credenciales en `.env`
3. Verificar que la base de datos `hotel_pms` existe

### **Error "Module not found"**
```bash
# Limpiar cache y reinstalar
rm -rf node_modules
rm yarn.lock
yarn install
```

### **Error de Prisma Client**
```bash
# Regenerar cliente
npx prisma generate
```

### **Puerto 3000 en uso**
```bash
# Cambiar puerto
yarn dev -p 3001
```

### **Errores de TypeScript**
- Verificar que todas las extensiones de TypeScript estén instaladas
- Reiniciar servidor TypeScript: Ctrl+Shift+P → "TypeScript: Restart TS Server"

---

## 📚 Estructura del Proyecto

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API Routes (60+ endpoints)
│   ├── auth/              # Autenticación
│   ├── dashboard/         # Dashboard principal
│   ├── rooms/             # Gestión habitaciones
│   ├── reservations/      # Sistema reservas
│   ├── housekeeping/      # Módulo limpieza
│   └── ...                # Otros módulos
├── components/            # Componentes React
│   ├── ui/               # Componentes UI base
│   └── ...               # Componentes específicos
├── lib/                  # Utilidades y configuración
├── prisma/               # Schema de base de datos
├── public/               # Assets públicos
└── scripts/              # Scripts de utilidad
```

---

## 🔐 Configuración de Seguridad

### **Variables de Entorno Sensibles**
- ✅ **Nunca commitear** archivos `.env` reales
- ✅ **Usar contraseñas seguras** para PostgreSQL
- ✅ **Generar NEXTAUTH_SECRET** único: https://generate-secret.vercel.app/32

### **Base de Datos**
- ✅ **Crear usuario específico** para la aplicación
- ✅ **No usar usuario `postgres`** en producción
- ✅ **Configurar firewall** apropiadamente

---

## 🚀 Despliegue en Producción (Opcional)

### **Opciones de Hosting**
1. **Vercel** (Recomendado para Next.js)
2. **Netlify**
3. **Railway**
4. **DigitalOcean**

### **Base de Datos en Producción**
1. **Supabase** (PostgreSQL managed)
2. **PlanetScale**
3. **Railway PostgreSQL**
4. **AWS RDS**

### **Variables de Entorno Producción**
```env
DATABASE_URL="postgresql://user:pass@production-host:5432/db"
NEXTAUTH_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="clave-super-segura-32-caracteres"
```

---

## 🎯 Funcionalidades Implementadas

### ✅ **Módulos Completos**
- [x] **Fundación y Configuración**
- [x] **Gestión de Habitaciones** 
- [x] **Sistema de Reservaciones**
- [x] **Check-in/Check-out**
- [x] **Reportes y Analytics**
- [x] **Sistema de Pagos y Facturación**
- [x] **Módulo de Housekeeping** ⭐ **NUEVO**

### 🔄 **Próximas Funcionalidades**
- [ ] Staff Management System completo
- [ ] Mobile Application (PWA)
- [ ] Multi-language Support
- [ ] Advanced Analytics con AI
- [ ] Integraciones externas (OTAs)

---

## 📞 Soporte y Documentación

### **Enlaces Útiles**
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Cursor Docs**: https://cursor.sh/docs

### **Archivos de Referencia**
- `prisma/schema.prisma` - Modelo de base de datos
- `lib/auth-options.ts` - Configuración de autenticación
- `app/api/` - Documentación de APIs

---

## 🎉 ¡Listo para Usar!

Una vez completados todos los pasos, tendrás un **Sistema de Gestión Hotelera completo** funcionando localmente en Windows con Cursor.

**Características destacadas**:
- ✅ 23+ páginas completamente funcionales
- ✅ 60+ API endpoints operativos  
- ✅ Base de datos con 30+ modelos
- ✅ Sistema de autenticación robusto
- ✅ Interface moderna y responsiva
- ✅ Módulo de Housekeeping completo

**¡Tu sistema PMS está listo para gestionar un hotel real!** 🏨✨

---

*Documento generado el 27 de Septiembre, 2025*  
*Sistema PMS Hotel Paseo Las Mercedes - Versión 7.0*  
*Compatible con Windows 10/11 + Cursor IDE*
