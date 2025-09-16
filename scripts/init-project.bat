@echo off
REM 🚀 Script de Inicialización del Proyecto PMS - Windows
REM Hotel Paseo Las Mercedes

echo 🏨 Inicializando Proyecto PMS - Hotel Paseo Las Mercedes
echo ==================================================

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado. Por favor instala Node.js 18.x o superior.
    pause
    exit /b 1
)
echo [SUCCESS] Node.js encontrado

REM Verificar si npm está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no está instalado.
    pause
    exit /b 1
)
echo [SUCCESS] npm encontrado

REM Crear archivo .env.local si no existe
if not exist ".env.local" (
    echo [INFO] Creando archivo .env.local...
    (
        echo # Database Configuration
        echo DATABASE_URL="postgresql://postgres:password@localhost:5432/hotel_pms_db"
        echo.
        echo # NextAuth Configuration
        echo NEXTAUTH_URL="http://localhost:3000"
        echo NEXTAUTH_SECRET="hotel-pms-secret-key-2024"
        echo.
        echo # Stripe Configuration ^(Optional - for payment processing^)
        echo STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
        echo STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
        echo STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
        echo.
        echo # App Configuration
        echo NEXT_PUBLIC_APP_URL="http://localhost:3000"
        echo NEXT_PUBLIC_APP_NAME="Hotel PMS - Paseo Las Mercedes"
        echo.
        echo # Development Configuration
        echo NODE_ENV="development"
    ) > .env.local
    echo [SUCCESS] Archivo .env.local creado
) else (
    echo [WARNING] Archivo .env.local ya existe
)

REM Instalar dependencias
echo [INFO] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Error al instalar dependencias
    pause
    exit /b 1
)
echo [SUCCESS] Dependencias instaladas

REM Generar cliente Prisma
echo [INFO] Generando cliente Prisma...
call npx prisma generate
if %errorlevel% neq 0 (
    echo [ERROR] Error al generar cliente Prisma
    pause
    exit /b 1
)
echo [SUCCESS] Cliente Prisma generado

REM Ejecutar migraciones
echo [INFO] Ejecutando migraciones de base de datos...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo [WARNING] Error en migraciones. Asegúrate de que PostgreSQL esté ejecutándose.
    echo [INFO] Puedes continuar y ejecutar las migraciones manualmente después.
)

REM Poblar base de datos
echo [INFO] Poblando base de datos con datos de prueba...
call npm run seed
if %errorlevel% neq 0 (
    echo [WARNING] Error al poblar base de datos. Puedes ejecutar 'npm run seed' manualmente después.
)

echo.
echo [SUCCESS] 🎉 ¡Proyecto inicializado exitosamente!
echo.
echo 📋 Próximos pasos:
echo 1. Verifica la configuración en .env.local
echo 2. Asegúrate de que PostgreSQL esté ejecutándose
echo 3. Ejecuta: npm run dev
echo 4. Visita: http://localhost:3000
echo.
echo 🔑 Credenciales de prueba:
echo    Admin: admin@hotelpms.com / admin123
echo    Recepción: reception@hotelpms.com / reception123
echo.
echo 📚 Documentación: setup-project.md
echo.
pause
