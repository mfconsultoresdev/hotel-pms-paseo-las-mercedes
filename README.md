# 🏨 Hotel PMS - Paseo Las Mercedes

Sistema de Gestión Hotelera (Property Management System) completo y moderno para el Hotel Paseo Las Mercedes.

## 🚀 Características

- **Gestión de Reservas** - Sistema completo de reservas y check-in/check-out
- **Gestión de Habitaciones** - Control de disponibilidad y estado de habitaciones
- **Gestión de Personal** - Control de empleados, horarios y asistencia
- **Gestión de Inventario** - Control de suministros y activos del hotel
- **Sistema de Pagos** - Integración con Stripe para procesamiento de pagos
- **Dashboard en Tiempo Real** - Métricas y estadísticas del hotel
- **Sistema de Autenticación** - Seguridad robusta con NextAuth.js
- **Base de Datos PostgreSQL** - Escalable y confiable
- **API RESTful** - Backend robusto y bien estructurado

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS
- **UI Components**: Radix UI
- **Pagos**: Stripe
- **Deploy**: Vercel + Supabase

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- PostgreSQL (para desarrollo local)

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/hotel-pms-paseo-las-mercedes.git
cd hotel-pms-paseo-las-mercedes/app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp env.production.example .env.local
# Editar .env.local con tus credenciales
```

### 4. Configurar base de datos
```bash
npx prisma generate
npx prisma db push
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

## 🌐 Deploy

### Vercel + Supabase (Recomendado)
1. Crear proyecto en [Supabase](https://supabase.com)
2. Crear proyecto en [Vercel](https://vercel.com)
3. Conectar repositorio de GitHub
4. Configurar variables de entorno
5. Deploy automático

## 📁 Estructura del Proyecto

```
app/
├── app/                    # Next.js App Router
│   ├── api/              # API Routes
│   ├── dashboard/        # Dashboard principal
│   ├── reservations/     # Gestión de reservas
│   ├── rooms/           # Gestión de habitaciones
│   └── ...
├── components/           # Componentes React reutilizables
├── lib/                 # Utilidades y configuraciones
├── prisma/              # Schema y migraciones de base de datos
├── types/               # Tipos TypeScript
└── public/              # Archivos estáticos
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting del código
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Sincronizar base de datos
- `npm run db:migrate` - Ejecutar migraciones

## 📊 Estado del Proyecto

- ✅ **Frontend**: Completado
- ✅ **Backend API**: Completado
- ✅ **Base de Datos**: Completado
- ✅ **Autenticación**: Completado
- ✅ **Deploy**: Configurado para Vercel
- 🔄 **Testing**: En desarrollo
- 🔄 **Documentación**: En progreso

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- 📧 Email: info@hotel.com
- 📱 Teléfono: +1234567890
- 🌐 Website: [hotel.com](https://hotel.com)

## 🙏 Agradecimientos

- Next.js por el framework increíble
- Prisma por el ORM robusto
- Vercel por la plataforma de deploy
- Supabase por la base de datos PostgreSQL
- La comunidad de desarrolladores

---

**🏨 Hotel Paseo Las Mercedes** - Transformando la gestión hotelera con tecnología moderna.
