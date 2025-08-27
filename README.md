# 🏨 Hotel PMS - Paseo Las Mercedes

Sistema de Gestión Hotelera (PMS) completo y moderno para el Hotel Paseo Las Mercedes.

## 🚀 Características

- **Gestión de Reservas**: Sistema completo de reservas y disponibilidad
- **Gestión de Huéspedes**: Perfiles detallados y historial de estancias
- **Gestión de Habitaciones**: Control de estado y mantenimiento
- **Facturación**: Sistema integrado de facturación y pagos
- **Housekeeping**: Gestión de limpieza y mantenimiento
- **Reportes**: Análisis y reportes en tiempo real
- **Móvil**: Interfaz responsive y PWA
- **Integraciones**: Stripe, PayPal, MercadoPago, etc.

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes, Prisma
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: NextAuth.js
- **UI**: Tailwind CSS, Shadcn/ui
- **Deploy**: Vercel
- **Base de Datos**: Supabase

## 📱 Funcionalidades Principales

### 🏠 Dashboard
- Métricas en tiempo real
- Actividad reciente
- Acciones rápidas
- Estado del hotel

### 👥 Gestión de Huéspedes
- Registro y check-in
- Perfiles detallados
- Historial de estancias
- Preferencias y notas

### 🛏️ Gestión de Habitaciones
- Estado en tiempo real
- Tipos de habitación
- Mantenimiento
- Limpieza

### 📅 Reservas
- Calendario de disponibilidad
- Gestión de reservas
- Check-in/Check-out
- Modificaciones

### 💰 Facturación
- Generación de facturas
- Múltiples métodos de pago
- Historial de transacciones
- Reportes financieros

### 🧹 Housekeeping
- Gestión de tareas
- Estado de limpieza
- Inventario de suministros
- Staff management

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- PostgreSQL (o Supabase)

### Pasos
1. Clonar el repositorio
```bash
git clone https://github.com/[TU-USUARIO]/hotel-pms-paseo-las-mercedes.git
cd hotel-pms-paseo-las-mercedes
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp env.example .env.local
# Editar .env.local con tus credenciales
```

4. Configurar base de datos
```bash
npx prisma generate
npx prisma db push
```

5. Ejecutar en desarrollo
```bash
npm run dev
```

## 🌐 Deploy

### Vercel + Supabase (Recomendado)
- **Hosting**: Vercel (gratis)
- **Base de Datos**: Supabase (gratis)
- **Guía completa**: [Ver documentación de deploy](GUIA_DEPLOY_COMPLETA_VERCEL_SUPABASE.md)

### Script automático
```powershell
.\scripts\deploy-vercel.ps1
```

## 📚 Documentación

- [Guía de Deploy](GUIA_DEPLOY_COMPLETA_VERCEL_SUPABASE.md)
- [Checklist de Deploy](CHECKLIST_DEPLOY_VERCEL.md)
- [Guía Gratuita](GUIA_DEPLOY_GRATUITO.md)
- [Variables de Entorno](env.vercel.example)
- [Crear Repositorio GitHub](GUIA_CREAR_REPOSITORIO_GITHUB.md)

## 🔧 Scripts Disponibles

- `npm run dev` - Desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linting
- `npm run test` - Tests

### Scripts de Automatización
- `.\scripts\create-github-repo.ps1` - Crear repositorio en GitHub
- `.\scripts\push-to-github.ps1` - Subir código a GitHub
- `.\scripts\deploy-vercel.ps1` - Deploy automático en Vercel

## 📊 Estado del Proyecto

- ✅ **FASE 1**: Estructura base y autenticación
- ✅ **FASE 2**: Gestión de huéspedes y habitaciones
- ✅ **FASE 3**: Sistema de reservas
- ✅ **FASE 4**: Facturación y pagos
- ✅ **FASE 5**: Housekeeping
- ✅ **FASE 6**: Reportes y analytics
- ✅ **FASE 7**: Integraciones de terceros
- ✅ **FASE 8**: Seguridad y compliance
- ✅ **FASE 9**: Mobile optimization
- ✅ **FASE 10**: Testing y QA
- ✅ **FASE 11**: Monitoreo y observabilidad
- 🚧 **FASE 12**: Deploy y producción

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Desarrollador**: [Tu Nombre]
- **Email**: [tu-email@ejemplo.com]
- **Proyecto**: [https://github.com/[TU-USUARIO]/hotel-pms-paseo-las-mercedes](https://github.com/[TU-USUARIO]/hotel-pms-paseo-las-mercedes)

## 🙏 Agradecimientos

- Next.js por el framework increíble
- Vercel por el hosting gratuito
- Supabase por la base de datos gratuita
- La comunidad de desarrolladores

---

**🏨 ¡Tu Hotel PMS estará funcionando en la nube en menos de 30 minutos!**


