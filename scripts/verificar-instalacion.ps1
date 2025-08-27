# Script de Verificacion Post-Instalacion - Hotel PMS
Write-Host "Verificando instalacion del Hotel PMS..." -ForegroundColor Green
Write-Host ""

# Verificar PostgreSQL
Write-Host "1. Verificando PostgreSQL..." -ForegroundColor Yellow
try {
    $pgVersion = psql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "PostgreSQL instalado: $pgVersion" -ForegroundColor Green
    } else {
        throw "PostgreSQL no encontrado"
    }
} catch {
    Write-Host "PostgreSQL NO esta instalado" -ForegroundColor Red
    Write-Host "Instala desde: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    exit 1
}

# Verificar Node.js
Write-Host "2. Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Node.js instalado: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js no encontrado"
    }
} catch {
    Write-Host "Node.js NO esta instalado" -ForegroundColor Red
    Write-Host "Instala desde: https://nodejs.org/en/download/" -ForegroundColor Cyan
    exit 1
}

# Verificar npm
Write-Host "3. Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "npm instalado: $npmVersion" -ForegroundColor Green
    } else {
        throw "npm no encontrado"
    }
} catch {
    Write-Host "npm NO esta instalado" -ForegroundColor Red
    exit 1
}

# Verificar archivo .env
Write-Host "4. Verificando archivo .env..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot "..\.env"
if (Test-Path $envPath) {
    Write-Host "Archivo .env encontrado" -ForegroundColor Green
} else {
    Write-Host "Archivo .env NO encontrado" -ForegroundColor Red
    exit 1
}

# Verificar conexion a PostgreSQL
Write-Host "5. Verificando conexion a PostgreSQL..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "admin123"
    $result = psql -U postgres -h localhost -p 5432 -c "SELECT version();" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Conexion a PostgreSQL exitosa" -ForegroundColor Green
    } else {
        throw "Conexion fallida"
    }
} catch {
    Write-Host "No se puede conectar a PostgreSQL" -ForegroundColor Red
    Write-Host "Verifica que PostgreSQL este ejecutandose" -ForegroundColor Yellow
    Write-Host "Verifica la contraseña: admin123" -ForegroundColor Yellow
    exit 1
}

# Verificar base de datos
Write-Host "6. Verificando base de datos..." -ForegroundColor Yellow
try {
    $result = psql -U postgres -h localhost -p 5432 -d hotel_pms -c "SELECT current_database();" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Base de datos hotel_pms encontrada" -ForegroundColor Green
    } else {
        Write-Host "Base de datos hotel_pms NO existe, creandola..." -ForegroundColor Yellow
        $result = psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE hotel_pms;" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Base de datos hotel_pms creada exitosamente" -ForegroundColor Green
        } else {
            Write-Host "Error creando base de datos" -ForegroundColor Red
            exit 1
        }
    }
} catch {
    Write-Host "Error verificando base de datos" -ForegroundColor Red
    exit 1
}

# Verificar dependencias
Write-Host "7. Verificando dependencias..." -ForegroundColor Yellow
$nodeModulesPath = Join-Path $PSScriptRoot "..\node_modules"
if (Test-Path $nodeModulesPath) {
    Write-Host "Dependencias ya instaladas" -ForegroundColor Green
} else {
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    try {
        Set-Location (Join-Path $PSScriptRoot "..")
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Dependencias instaladas exitosamente" -ForegroundColor Green
        } else {
            throw "Error en instalacion"
        }
    } catch {
        Write-Host "Error instalando dependencias" -ForegroundColor Red
        exit 1
    }
}

# Generar cliente Prisma
Write-Host "8. Generando cliente Prisma..." -ForegroundColor Yellow
try {
    Set-Location (Join-Path $PSScriptRoot "..")
    npx prisma generate
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Cliente Prisma generado exitosamente" -ForegroundColor Green
    } else {
        throw "Error generando cliente"
    }
} catch {
    Write-Host "Error generando cliente Prisma" -ForegroundColor Red
    exit 1
}

# Crear esquema de base de datos
Write-Host "9. Creando esquema de base de datos..." -ForegroundColor Yellow
try {
    npx prisma db push
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Esquema de base de datos creado exitosamente" -ForegroundColor Green
    } else {
        throw "Error creando esquema"
    }
} catch {
    Write-Host "Error creando esquema de base de datos" -ForegroundColor Red
    exit 1
}

# Insertar datos iniciales
Write-Host "10. Insertando datos iniciales..." -ForegroundColor Yellow
try {
    npm run prisma:seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Datos iniciales insertados exitosamente" -ForegroundColor Green
    } else {
        Write-Host "Advertencia: Error ejecutando seed" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Advertencia: Error ejecutando seed" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Verificacion completada exitosamente!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "PostgreSQL: Instalado y funcionando" -ForegroundColor Green
Write-Host "Node.js: Instalado y funcionando" -ForegroundColor Green
Write-Host "Base de datos: Creada y configurada" -ForegroundColor Green
Write-Host "Dependencias: Instaladas" -ForegroundColor Green
Write-Host "Cliente Prisma: Generado" -ForegroundColor Green
Write-Host "Esquema: Creado" -ForegroundColor Green

Write-Host ""
Write-Host "El sistema esta listo para usar!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "1. Ejecuta: npm run dev" -ForegroundColor Cyan
Write-Host "2. Abre: http://localhost:3000" -ForegroundColor Cyan
Write-Host "3. Usuario: admin@hotel.com" -ForegroundColor Cyan
Write-Host "4. Contrasena: admin123" -ForegroundColor Cyan


