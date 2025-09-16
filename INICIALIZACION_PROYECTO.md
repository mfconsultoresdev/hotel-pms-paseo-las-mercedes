# 🚀 Guía de Inicialización del Proyecto PMS

## ✅ Estado Actual del Proyecto

### ✅ Completado:
- ✅ Estructura del proyecto verificada
- ✅ Variables de entorno configuradas (`.env.local` y `.env`)
- ✅ Dependencias instaladas (`npm install --legacy-peer-deps`)
- ✅ Cliente Prisma generado (`npx prisma generate`)

### ⏳ Pendiente:
- ⏳ Configuración de base de datos PostgreSQL
- ⏳ Ejecución de migraciones
- ⏳ Poblado de datos de prueba
- ⏳ Inicio del servidor de desarrollo

## 🗄️ Configuración de Base de Datos

### Opción 1: PostgreSQL Local (Recomendado)

#### Instalación de PostgreSQL:
1. **Descargar PostgreSQL**: https://www.postgresql.org/download/windows/
2. **Instalar** con las opciones por defecto
3. **Configurar contraseña** para el usuario `postgres`
4. **Crear base de datos**:
   ```sql
   CREATE DATABASE hotel_pms_db;
   ```

#### Actualizar variables de entorno:
Edita el archivo `.env` y `.env.local` con tus credenciales:
```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/hotel_pms_db"
```

### Opción 2: Docker (Si está disponible)

```bash
# Ejecutar PostgreSQL en Docker
docker run --name hotel-pms-db \
  -e POSTGRES_DB=hotel_pms_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

### Opción 3: Base de Datos en la Nube

#### Supabase (Gratuito):
1. Crear cuenta en https://supabase.com
2. Crear nuevo proyecto
3. Copiar la URL de conexión
4. Actualizar `DATABASE_URL` en `.env`

#### Railway (Gratuito):
1. Crear cuenta en https://railway.app
2. Crear nuevo proyecto PostgreSQL
3. Copiar la URL de conexión
4. Actualizar `DATABASE_URL` en `.env`

## 🔧 Comandos para Continuar

Una vez configurada la base de datos, ejecuta:

```bash
# 1. Ejecutar migraciones
npx prisma migrate dev --name init

# 2. Poblar con datos de prueba
npm run seed

# 3. Iniciar servidor de desarrollo
npm run dev
```

## 🎯 Acceso al Sistema

Una vez iniciado el servidor:
- **URL**: http://localhost:3000
- **Login Admin**: admin@hotelpms.com / admin123
- **Login Recepción**: reception@hotelpms.com / reception123

## 📋 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Ejecutar linter
npm run seed         # Poblar base de datos
npm run db:generate  # Generar cliente Prisma
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Abrir Prisma Studio
npm run db:reset     # Resetear base de datos
npm run setup        # Setup completo
```

## 🚨 Solución de Problemas

### Error de Conexión a Base de Datos:
1. Verificar que PostgreSQL esté ejecutándose
2. Verificar credenciales en `.env`
3. Verificar que la base de datos existe
4. Verificar que el puerto 5432 esté disponible

### Error de Migraciones:
```bash
npx prisma migrate reset
npx prisma migrate dev
```

### Error de Dependencias:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📞 Próximos Pasos

1. **Configurar PostgreSQL** (una de las opciones arriba)
2. **Ejecutar migraciones**: `npx prisma migrate dev --name init`
3. **Poblar datos**: `npm run seed`
4. **Iniciar desarrollo**: `npm run dev`
5. **Acceder al sistema**: http://localhost:3000

## 🎉 ¡Proyecto Listo!

Una vez completados estos pasos, tendrás el sistema PMS completamente funcional con:
- ✅ Dashboard con métricas en tiempo real
- ✅ Gestión de habitaciones y reservas
- ✅ Sistema de facturación fiscal venezolano
- ✅ Módulo de housekeeping
- ✅ Gestión de personal
- ✅ Sistema de comunicaciones
- ✅ Cuentas por cobrar
- ✅ Integración de pagos
