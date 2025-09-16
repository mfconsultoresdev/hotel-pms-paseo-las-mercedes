# 🗄️ Script de Configuración de PostgreSQL para Hotel PMS
# Este script ayuda a configurar PostgreSQL localmente

Write-Host "🗄️ Configuración de PostgreSQL para Hotel PMS" -ForegroundColor Blue
Write-Host "=============================================" -ForegroundColor Blue

# Verificar si PostgreSQL está instalado
$postgresInstalled = $false
try {
    $psqlVersion = & psql --version 2>$null
    if ($psqlVersion) {
        Write-Host "✅ PostgreSQL encontrado: $psqlVersion" -ForegroundColor Green
        $postgresInstalled = $true
    }
} catch {
    Write-Host "❌ PostgreSQL no encontrado" -ForegroundColor Red
}

if (-not $postgresInstalled) {
    Write-Host ""
    Write-Host "📥 Instalación de PostgreSQL:" -ForegroundColor Yellow
    Write-Host "1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/"
    Write-Host "2. Instala con las opciones por defecto"
    Write-Host "3. Configura una contraseña para el usuario 'postgres'"
    Write-Host "4. Ejecuta este script nuevamente"
    Write-Host ""
    Write-Host "💡 Alternativa: Usar una base de datos en la nube (Supabase, Railway)"
    Write-Host ""
    return
}

# Verificar conexión a PostgreSQL
Write-Host ""
Write-Host "🔍 Verificando conexión a PostgreSQL..." -ForegroundColor Yellow

$env:PGPASSWORD = "password"  # Contraseña por defecto
try {
    $testConnection = & psql -h localhost -U postgres -d postgres -c "SELECT version();" 2>$null
    if ($testConnection) {
        Write-Host "✅ Conexión exitosa a PostgreSQL" -ForegroundColor Green
    } else {
        throw "Error de conexión"
    }
} catch {
    Write-Host "❌ Error de conexión a PostgreSQL" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔧 Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "1. Verificar que PostgreSQL esté ejecutándose"
    Write-Host "2. Verificar la contraseña del usuario 'postgres'"
    Write-Host "3. Actualizar la variable DATABASE_URL en .env"
    Write-Host ""
    Write-Host "📝 Ejemplo de DATABASE_URL:"
    Write-Host "DATABASE_URL=`"postgresql://postgres:TU_PASSWORD@localhost:5432/hotel_pms_db`""
    Write-Host ""
    return
}

# Crear base de datos si no existe
Write-Host ""
Write-Host "🗄️ Creando base de datos 'hotel_pms_db'..." -ForegroundColor Yellow

try {
    $createDb = & psql -h localhost -U postgres -d postgres -c "CREATE DATABASE hotel_pms_db;" 2>$null
    Write-Host "✅ Base de datos 'hotel_pms_db' creada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "ℹ️ La base de datos 'hotel_pms_db' ya existe o hubo un error" -ForegroundColor Yellow
}

# Verificar que la base de datos existe
try {
    $checkDb = & psql -h localhost -U postgres -d hotel_pms_db -c "SELECT current_database();" 2>$null
    if ($checkDb) {
        Write-Host "✅ Base de datos 'hotel_pms_db' verificada" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error al verificar la base de datos" -ForegroundColor Red
    return
}

Write-Host ""
Write-Host "🎉 ¡PostgreSQL configurado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Blue
Write-Host "1. Ejecutar migraciones: npx prisma migrate dev --name init"
Write-Host "2. Poblar datos: npm run seed"
Write-Host "3. Iniciar servidor: npm run dev"
Write-Host ""
Write-Host "🌐 Acceso: http://localhost:3000" -ForegroundColor Cyan
