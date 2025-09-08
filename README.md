
# 🏨 Sistema PMS Hotel Paseo Las Mercedes

**Sistema de Gestión Hotelera Completo** desarrollado con Next.js 14, TypeScript y tecnologías modernas.

## 🌟 Características Principales

### ✨ Funcionalidades Implementadas

- **🏠 Gestión de Habitaciones**: CRUD completo, tipos de habitación, disponibilidad en tiempo real
- **📅 Sistema de Reservas**: Reservas online, calendario interactivo, gestión de huéspedes
- **✅ Check-in/Check-out**: Proceso automatizado, asignación de habitaciones, facturación
- **💰 Facturación y Pagos**: Integración con Stripe, múltiples métodos de pago, reportes financieros
- **👥 Gestión de Personal**: Horarios, asistencia, roles y permisos
- **📱 Comunicaciones**: Sistema de mensajería con huéspedes, plantillas automatizadas
- **🚪 Portal de Huéspedes**: Acceso independiente para huéspedes, historial de reservas
- **🧹 Módulo de Housekeeping**: Gestión de limpieza, inventario, tareas programadas
- **📊 Reportes y Analytics**: Dashboard completo, métricas financieras y ocupación

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño responsivo  
- **Radix UI** - Componentes accesibles
- **React Hook Form** - Manejo de formularios
- **Recharts** - Gráficos y visualizaciones

### Backend
- **Next.js API Routes** - API RESTful
- **PostgreSQL** - Base de datos relacional
- **Prisma ORM** - Abstracción de base de datos
- **NextAuth.js** - Autenticación y sesiones

### Servicios Externos
- **Stripe** - Procesamiento de pagos
- **Resend** - Envío de emails (configurado)

## 📦 Instalación

### 🚀 **OPCIÓN 1: Paquete Comprimido (RECOMENDADO)**

**⬇️ Descarga Directa:**
1. Descargar: `hotel-pms-paseo-las-mercedes-completo.zip` (540KB)
2. Descomprimir el archivo
3. **Windows**: Doble clic en `SETUP_AUTOMATICO.bat`
4. **Manual**: Seguir `GUIA_INSTALACION_CURSOR_SIMPLE.md`
5. ¡Listo en 5 minutos! 🎉

### 🔧 **OPCIÓN 2: Clonación Tradicional**

#### Prerrequisitos
- Node.js 18+
- PostgreSQL
- Yarn (recomendado)

#### 1. Clonar el repositorio
```bash
git clone https://github.com/mfconsultoresdev/hotel-pms-paseo-las-mercedes-chatllm.git
cd hotel-pms-paseo-las-mercedes-chatllm
```

### 2. Instalar dependencias
```bash
cd app
yarn install
```

### 3. Configurar variables de entorno
Crear `.env` en el directorio `app/`:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/hotel_pms"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu_secret_key_aqui"

# Stripe (opcional)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (opcional)
RESEND_API_KEY="re_..."
```

### 4. Configurar la base de datos
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate deploy

# Poblar con datos iniciales
npm run seed
```

### 5. Ejecutar en desarrollo
```bash
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🚀 Producción

### Build
```bash
yarn build
yarn start
```

### Docker (opcional)
```bash
# Crear imagen
docker build -t hotel-pms .

# Ejecutar contenedor
docker run -p 3000:3000 hotel-pms
```

## 📱 Uso

### 👨‍💼 Panel Administrativo
- **URL**: `http://localhost:3000/dashboard`
- **Usuario inicial**: Creado durante el seed
- Acceso completo a todas las funcionalidades

### 🏨 Portal de Huéspedes  
- **URL**: `http://localhost:3000/guest-portal`
- **Credenciales**: Generadas automáticamente para cada huésped

## 🗄️ Estructura de la Base de Datos

### Modelos Principales
- **Users** - Usuarios del sistema (staff)
- **Hotels** - Información del hotel
- **RoomTypes** - Tipos de habitaciones
- **Rooms** - Habitaciones individuales
- **Guests** - Información de huéspedes
- **Reservations** - Reservas y bookings
- **Invoices** - Facturas y billing
- **Payments** - Pagos procesados
- **Staff** - Personal del hotel
- **Communications** - Mensajes y notificaciones
- **HousekeepingTasks** - Tareas de limpieza

## 📊 APIs Disponibles

### Endpoints Principales
```
/api/rooms - Gestión de habitaciones
/api/reservations - Sistema de reservas  
/api/guests - Información de huéspedes
/api/invoices - Facturación
/api/payments - Procesamiento de pagos
/api/staff - Gestión de personal
/api/communications - Mensajería
/api/housekeeping - Tareas de limpieza
/api/reports - Reportes y analytics
```

## 🔧 Desarrollo

### Comandos útiles
```bash
# Desarrollo
yarn dev

# Build
yarn build

# Linting
yarn lint

# Base de datos
npx prisma studio          # Explorador visual
npx prisma migrate dev     # Nueva migración
npx prisma migrate reset   # Reset completo
npm run seed              # Poblar datos
```

### Estructura del Proyecto
```
app/
├── app/                 # App Router de Next.js
│   ├── dashboard/      # Panel administrativo
│   ├── guest-portal/   # Portal de huéspedes  
│   └── api/           # API Routes
├── components/        # Componentes reutilizables
├── lib/              # Utilidades y configuraciones
├── prisma/           # Schema y migraciones
└── scripts/          # Scripts de seed y utilidades
```

## 🚧 Próximas Funcionalidades

### En Desarrollo
- **📱 App Móvil**: React Native para staff y huéspedes
- **🌍 Multi-idioma**: Soporte i18n completo
- **📈 Analytics Avanzados**: ML para predicciones y optimización
- **🔗 Integraciones**: Booking.com, Expedia, redes sociales

### Backlog
- **📊 Business Intelligence**: Dashboards ejecutivos
- **🤖 Chatbot**: Asistente virtual para huéspedes
- **🔐 Single Sign-On**: Integración con sistemas corporativos
- **☁️ Multi-tenant**: Soporte para múltiples hoteles

## 📄 Documentación

- **[Resumen del Proyecto](PROJECT_SUMMARY.md)** - Overview técnico completo
- **[Progreso y Prioridades](RESUMEN_PROGRESO_Y_PRIORIDADES.md)** - Estado actual y roadmap
- **[Análisis del Sistema](analisis_sistema_mcp.md)** - Análisis técnico detallado

## 👥 Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)  
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📝 Licencia

Este proyecto está licenciado bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- **Issues**: Usar el sistema de issues de GitHub
- **Documentación**: Consultar archivos .md en el repositorio
- **Wiki**: Documentación extendida disponible en GitHub Wiki

---

**Desarrollado con ❤️ para Hotel Paseo Las Mercedes**

*Sistema PMS completo y moderno, listo para producción*
