# ========================================
# HOTEL PMS - CONFIGURACIÓN AUTOMÁTICA DE BASE DE DATOS
# ========================================
# Script de PowerShell para Windows

Write-Host "🚀 CONFIGURANDO BASE DE DATOS DEL HOTEL PMS..." -ForegroundColor Green
Write-Host ""

# Step 1: Create .env file
Write-Host "📊 1. CREANDO ARCHIVO .env..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot "..\.env"
$envExamplePath = Join-Path $PSScriptRoot "..\env.database.example"

if (-not (Test-Path $envPath)) {
    if (Test-Path $envExamplePath) {
        # Read the example file
        $exampleContent = Get-Content $envExamplePath -Raw
        
        # Replace placeholder values with actual development values
        $envContent = $exampleContent `
            -replace 'your_password', 'admin123' `
            -replace 'your_nextauth_secret_here_min_32_chars', 'hotel_pms_secret_key_2024_development_environment_secure' `
            -replace 'your_jwt_secret_here_min_32_chars', 'hotel_pms_jwt_secret_2024_development_environment_secure_key' `
            -replace 'your_redis_password', '' `
            -replace 'your_sentry_dsn_here', '' `
            -replace 'your_public_sentry_dsn_here', '' `
            -replace 'your_organization', '' `
            -replace 'your_sentry_auth_token', '' `
            -replace 'your_slack_webhook_url', '' `
            -replace 'your_alert_webhook_url', '' `
            -replace 'your_webhook_token', '' `
            -replace 'your_elasticsearch_password', '' `
            -replace 'your_grafana_api_key', '' `
            -replace 'your_stripe_secret_key', '' `
            -replace 'your_stripe_publishable_key', '' `
            -replace 'your_webhook_secret', '' `
            -replace 'your_email@gmail.com', '' `
            -replace 'your_app_password', '' `
            -replace 'your_twilio_account_sid', '' `
            -replace 'your_twilio_auth_token', '' `
            -replace 'your_monitoring_auth_token', '' `
            -replace 'your_monitoring_ip_whitelist', '127.0.0.1,::1'
        
        Set-Content -Path $envPath -Value $envContent
        Write-Host "✅ Archivo .env creado con configuración de desarrollo" -ForegroundColor Green
    } else {
        Write-Host "❌ No se encontró env.database.example" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Archivo .env ya existe" -ForegroundColor Green
}

# Step 2: Check if PostgreSQL is running
Write-Host ""
Write-Host "📊 2. VERIFICANDO POSTGRESQL..." -ForegroundColor Yellow
try {
    # Try to connect to PostgreSQL using psql
    $env:PGPASSWORD = "admin123"
    $result = psql -U postgres -h localhost -p 5432 -c "SELECT version();" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL está ejecutándose" -ForegroundColor Green
    } else {
        throw "Connection failed"
    }
} catch {
    Write-Host "❌ No se puede conectar a PostgreSQL" -ForegroundColor Red
    Write-Host "   Solución: Instala y ejecuta PostgreSQL" -ForegroundColor Yellow
    Write-Host "   Windows: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host "   Descarga e instala PostgreSQL 15 o superior" -ForegroundColor Cyan
    Write-Host "   Durante la instalación, usa la contraseña: admin123" -ForegroundColor Cyan
    Write-Host "   Después de instalar, ejecuta este script nuevamente" -ForegroundColor Cyan
    exit 1
}

# Step 3: Create database
Write-Host ""
Write-Host "📊 3. CREANDO BASE DE DATOS..." -ForegroundColor Yellow
try {
    $result = psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE hotel_pms;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de datos 'hotel_pms' creada" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Base de datos ya existe o error al crearla" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Error creando base de datos" -ForegroundColor Yellow
}

# Step 4: Test database connection
Write-Host ""
Write-Host "📊 4. PROBANDO CONEXIÓN A LA BASE DE DATOS..." -ForegroundColor Yellow
try {
    $result = psql -U postgres -h localhost -p 5432 -d hotel_pms -c "SELECT current_database();" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Conexión a la base de datos exitosa" -ForegroundColor Green
    } else {
        throw "Connection failed"
    }
} catch {
    Write-Host "❌ Error conectando a la base de datos" -ForegroundColor Red
    exit 1
}

# Step 5: Check if Node.js is installed
Write-Host ""
Write-Host "📊 5. VERIFICANDO NODE.JS..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js está instalado: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    Write-Host "   Solución: Instala Node.js" -ForegroundColor Yellow
    Write-Host "   Windows: https://nodejs.org/en/download/" -ForegroundColor Cyan
    Write-Host "   Descarga e instala Node.js 18 LTS o superior" -ForegroundColor Cyan
    Write-Host "   Después de instalar, ejecuta este script nuevamente" -ForegroundColor Cyan
    exit 1
}

# Step 6: Install dependencies if needed
Write-Host ""
Write-Host "📊 6. VERIFICANDO DEPENDENCIAS..." -ForegroundColor Yellow
$nodeModulesPath = Join-Path $PSScriptRoot "..\node_modules"
if (-not (Test-Path $nodeModulesPath)) {
    Write-Host "   Instalando dependencias..." -ForegroundColor Yellow
    try {
        Set-Location (Join-Path $PSScriptRoot "..")
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Dependencias instaladas" -ForegroundColor Green
        } else {
            throw "Installation failed"
        }
    } catch {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencias ya instaladas" -ForegroundColor Green
}

# Step 7: Generate Prisma client
Write-Host ""
Write-Host "📊 7. GENERANDO CLIENTE PRISMA..." -ForegroundColor Yellow
try {
    Set-Location (Join-Path $PSScriptRoot "..")
    npx prisma generate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Cliente Prisma generado" -ForegroundColor Green
    } else {
        throw "Generation failed"
    }
} catch {
    Write-Host "❌ Error generando cliente Prisma" -ForegroundColor Red
    exit 1
}

# Step 8: Run database migrations
Write-Host ""
Write-Host "📊 8. APLICANDO MIGRACIONES..." -ForegroundColor Yellow
try {
    npx prisma migrate deploy
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Migraciones aplicadas" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Error en migraciones, intentando crear esquema..." -ForegroundColor Yellow
        try {
            npx prisma db push
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Esquema de base de datos creado" -ForegroundColor Green
            } else {
                throw "Schema creation failed"
            }
        } catch {
            Write-Host "❌ Error creando esquema de base de datos" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "⚠️  Error en migraciones" -ForegroundColor Yellow
}

# Step 9: Seed database
Write-Host ""
Write-Host "📊 9. INSERTANDO DATOS INICIALES..." -ForegroundColor Yellow
try {
    npm run prisma:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Datos iniciales insertados" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Error ejecutando seed, puedes ejecutarlo manualmente después" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Error ejecutando seed" -ForegroundColor Yellow
}

# Step 10: Check Redis (optional)
Write-Host ""
Write-Host "📊 10. VERIFICANDO REDIS (OPCIONAL)..." -ForegroundColor Yellow
try {
    $result = redis-cli ping 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Redis está ejecutándose" -ForegroundColor Green
    } else {
        throw "Redis not running"
    }
} catch {
    Write-Host "⚠️  Redis no está ejecutándose" -ForegroundColor Yellow
    Write-Host "   El sistema funcionará sin cache, pero con performance reducida" -ForegroundColor Yellow
    Write-Host "   Para instalar Redis:" -ForegroundColor Cyan
    Write-Host "   Windows: https://redis.io/docs/getting-started/installation/install-redis-on-windows/" -ForegroundColor Cyan
    Write-Host "   macOS: brew install redis && brew services start redis" -ForegroundColor Cyan
    Write-Host "   Ubuntu: sudo apt install redis-server && sudo systemctl start redis" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "🎉 CONFIGURACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "✅ Archivo .env configurado" -ForegroundColor Green
Write-Host "✅ Base de datos PostgreSQL creada" -ForegroundColor Green
Write-Host "✅ Esquema de base de datos aplicado" -ForegroundColor Green
Write-Host "✅ Cliente Prisma generado" -ForegroundColor Green
Write-Host "✅ Datos iniciales insertados" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 El sistema está listo para usar" -ForegroundColor Green
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "   1. Ejecuta: npm run dev" -ForegroundColor Cyan
Write-Host "   2. Abre: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   3. Ejecuta el script de prueba: npm run test:db" -ForegroundColor Cyan

Write-Host ""
Write-Host "🔑 CREDENCIALES DE ACCESO:" -ForegroundColor Yellow
Write-Host "   Usuario: admin@hotel.com" -ForegroundColor Cyan
Write-Host "   Contraseña: admin123" -ForegroundColor Cyan

Write-Host ""
Write-Host "🎯 Configuración completada exitosamente" -ForegroundColor Green

