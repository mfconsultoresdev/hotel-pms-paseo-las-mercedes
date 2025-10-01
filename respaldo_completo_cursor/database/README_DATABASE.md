
# 🗄️ Base de Datos Hotel PMS

## Archivo de Migración

**Archivo**: `hotel_pms_database_migration.sql`

Este archivo contiene el **schema completo** de la base de datos PostgreSQL con:
- **30+ tablas** del sistema hotelero
- **Relaciones y constraints** completas
- **Índices optimizados** para rendimiento
- **Compatibilidad** con PostgreSQL 12+

## Aplicar la Migración

### Opción 1: pgAdmin 4 (Interfaz Gráfica)
1. Abrir **pgAdmin 4**
2. Crear base de datos `hotel_pms`
3. Click derecho → **Query Tool**
4. **Open File** → Seleccionar `hotel_pms_database_migration.sql`
5. **Execute** (F5)

### Opción 2: psql (Línea de comandos)
```bash
# Crear base de datos
createdb -U postgres hotel_pms

# Aplicar migración
psql -U postgres -d hotel_pms -f hotel_pms_database_migration.sql
```

### Opción 3: Desde la aplicación (Recomendado)
```bash
# En el directorio de la aplicación
npx prisma db push
npx prisma generate
```

## Datos de Prueba

Después de aplicar la migración, ejecutar:
```bash
# En el directorio de la aplicación
yarn tsx scripts/seed.ts
```

Esto poblará la base de datos con:
- **Usuarios de prueba** (admin, gerente, recepcionista)
- **Habitaciones de ejemplo**
- **Tipos de habitación**
- **Huéspedes de prueba**
- **Reservaciones de ejemplo**
- **Datos de housekeeping**

## Estructura de Tablas

### **Core Hotel Management**
- `hotels` - Información del hotel
- `users` - Usuarios del sistema
- `roles` - Roles y permisos
- `floors` - Pisos del hotel
- `room_types` - Tipos de habitación
- `rooms` - Habitaciones
- `guests` - Huéspedes
- `services` - Servicios del hotel

### **Reservaciones y Operaciones**
- `reservations` - Reservas
- `transactions` - Transacciones
- `check_ins` - Check-ins
- `check_outs` - Check-outs
- `service_requests` - Solicitudes de servicio

### **Facturación y Pagos**
- `invoices` - Facturas
- `invoice_items` - Items de factura
- `payments` - Pagos
- `payment_methods` - Métodos de pago
- `tax_config` - Configuración de impuestos

### **Housekeeping** ⭐
- `housekeeping_tasks` - Tareas de limpieza
- `housekeeping_task_items` - Items de tareas
- `housekeeping_staff` - Personal de limpieza
- `housekeeping_supplies` - Suministros
- `housekeeping_supply_usage` - Uso de suministros
- `housekeeping_attendance` - Asistencia
- `room_inspections` - Inspecciones

### **Gestión de Personal**
- `staff` - Personal del hotel
- `staff_schedules` - Horarios
- `staff_attendance` - Asistencia
- `time_entries` - Registro de tiempo
- `staff_evaluations` - Evaluaciones

### **Comunicaciones**
- `message_templates` - Plantillas de mensajes
- `communication_messages` - Mensajes
- `communication_recipients` - Destinatarios
- `notifications` - Notificaciones

## Usuarios de Prueba Creados

```sql
-- Administrador
email: admin@hotelpaseolm.com
password: admin123

-- Gerente  
email: gerente@hotelpaseolm.com
password: admin123

-- Recepcionista
email: recepcion@hotelpaseolm.com
password: admin123
```

## Conexión Recomendada

```env
DATABASE_URL="postgresql://username:password@localhost:5432/hotel_pms"
```

**Nota**: Reemplazar `username` y `password` con tus credenciales de PostgreSQL.
