# 🏨 Hotel PMS - Paseo Las Mercedes

Sistema de Gestión de Propiedad Hotelera (Property Management System) completo desarrollado con Next.js 14, TypeScript y Supabase.

## 🚀 Características Principales

### ✅ **Gestión Completa del Hotel**
- 🏨 **Gestión de Hoteles**: Configuración y administración
- 🚪 **Gestión de Habitaciones**: Tipos, pisos, disponibilidad
- 👥 **Gestión de Huéspedes**: Registro, historial, comunicación
- 📅 **Sistema de Reservaciones**: Check-in/out, modificaciones
- 💰 **Facturación y Pagos**: Invoices, pagos, cuentas por cobrar
- 🧹 **Housekeeping**: Tareas, inventario, inspecciones
- 👨‍💼 **Gestión de Personal**: Staff, horarios, evaluaciones
- 📊 **Reportes y Analytics**: Métricas, tendencias, KPIs

### 🛠️ **Tecnologías Utilizadas**
- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: NextAuth.js
- **Pagos**: Stripe Integration
- **Estado**: Zustand, React Query

## 📊 **Base de Datos - 40 Tablas**

### **Autenticación (3 tablas)**
- Account, Session, VerificationToken

### **Core Hotel (10 tablas)**
- hotels, roles, users, floors, room_types, rooms, guests, services, reservations, transactions

### **Operaciones (8 tablas)**
- check_ins, check_outs, service_requests, invoices, invoice_items, payments, payment_methods, tax_config, fiscal_periods

### **Housekeeping (8 tablas)**
- housekeeping_tasks, housekeeping_task_items, housekeeping_staff, housekeeping_supplies, housekeeping_supply_usage, housekeeping_inventory_movements, housekeeping_attendance, room_inspections

### **Staff Management (5 tablas)**
- staff, staff_schedules, staff_attendance, time_entries, staff_evaluations

### **Comunicaciones (6 tablas)**
- message_templates, communication_messages, communication_recipients, guest_communication_recipients, notifications

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**
- Node.js 18+
- npm o yarn
- Cuenta de Supabase

### **Instalación**
```bash
# Clonar el repositorio
git clone <repository-url>
cd hotel_pms_paseo_las_mercedes/app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones (si es necesario)
npx prisma migrate dev

# Iniciar desarrollo
npm run dev
```

### **Variables de Entorno Requeridas**
```env
# Base de datos
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."

# Stripe (opcional)
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_SECRET_KEY="sk_..."
```

## 📱 **Funcionalidades del Sistema**

### **Dashboard Principal**
- 📊 Métricas en tiempo real
- 📈 Gráficos de ocupación y revenue
- 🚨 Alertas y notificaciones
- ⚡ Acciones rápidas

### **Gestión de Reservaciones**
- 📅 Calendario de disponibilidad
- 🔍 Búsqueda avanzada
- ✏️ Modificaciones en tiempo real
- 📧 Confirmaciones automáticas

### **Sistema de Facturación**
- 💰 Generación automática de invoices
- 💳 Múltiples métodos de pago
- 📊 Reportes de revenue
- 🔄 Gestión de cuentas por cobrar

### **Housekeeping**
- 🧹 Gestión de tareas
- 📋 Listas de verificación
- 📦 Control de inventario
- 👥 Asignación de personal

### **Portal de Huéspedes**
- 📱 Acceso móvil
- 📧 Comunicaciones
- 💳 Pagos online
- ⭐ Feedback y reviews

## 🚀 **Deployment**

### **Vercel (Recomendado)**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Docker**
```bash
# Build
docker build -t hotel-pms .

# Run
docker run -p 3000:3000 hotel-pms
```

Ver [GUIA_DEPLOYMENT_COMPLETA.md](./GUIA_DEPLOYMENT_COMPLETA.md) para instrucciones detalladas.

## 📁 **Estructura del Proyecto**

```
app/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Páginas del dashboard
│   ├── api/               # API Routes
│   └── auth/              # Páginas de autenticación
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Radix UI)
│   ├── dashboard/        # Componentes del dashboard
│   └── layout/           # Componentes de layout
├── lib/                  # Utilidades y configuración
├── prisma/               # Esquema de base de datos
├── scripts/              # Scripts de utilidad
└── types/                # Definiciones de TypeScript
```

## 🧪 **Scripts Disponibles**

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run seed         # Seed de base de datos
npm run db:generate  # Generar cliente Prisma
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Prisma Studio
```

## 📊 **Estado del Proyecto**

- ✅ **Base de datos**: 40 tablas funcionando en Supabase
- ✅ **API REST**: Completamente funcional
- ✅ **Frontend**: UI completa con Tailwind CSS
- ✅ **Autenticación**: NextAuth.js configurado
- ✅ **Deployment**: Listo para producción

## 🤝 **Contribución**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 **Soporte**

Para soporte y preguntas:
- 📧 Email: support@hotelpms.com
- 📱 Teléfono: +1 (555) 123-4567
- 🌐 Website: https://hotelpms.com

---

**Desarrollado con ❤️ para la gestión eficiente de hoteles**
