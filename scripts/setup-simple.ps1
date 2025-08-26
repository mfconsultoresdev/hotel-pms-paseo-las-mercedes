# Hotel PMS - Setup Simple
Write-Host "Configurando Hotel PMS..." -ForegroundColor Green

# Step 1: Create .env file
Write-Host "1. Creando archivo .env..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot "..\.env"
$envExamplePath = Join-Path $PSScriptRoot "..\env.database.example"

if (-not (Test-Path $envPath)) {
    if (Test-Path $envExamplePath) {
        $exampleContent = Get-Content $envExamplePath -Raw
        $envContent = $exampleContent `
            -replace 'your_password', 'admin123' `
            -replace 'your_nextauth_secret_here_min_32_chars', 'hotel_pms_secret_key_2024_development_environment_secure' `
            -replace 'your_jwt_secret_here_min_32_chars', 'hotel_pms_jwt_secret_2024_development_environment_secure_key' `
            -replace 'your_redis_password', ''
        
        Set-Content -Path $envPath -Value $envContent
        Write-Host "Archivo .env creado" -ForegroundColor Green
    } else {
        Write-Host "No se encontro env.database.example" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Archivo .env ya existe" -ForegroundColor Green
}

# Step 2: Check PostgreSQL
Write-Host "2. Verificando PostgreSQL..." -ForegroundColor Yellow
try {
    $env:PGPASSWORD = "admin123"
    $result = psql -U postgres -h localhost -p 5432 -c "SELECT version();" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "PostgreSQL esta ejecutandose" -ForegroundColor Green
    } else {
        throw "Connection failed"
    }
} catch {
    Write-Host "No se puede conectar a PostgreSQL" -ForegroundColor Red
    Write-Host "Instala PostgreSQL desde: https://www.postgresql.org/download/windows/" -ForegroundColor Cyan
    Write-Host "Usa la contraseña: admin123" -ForegroundColor Cyan
    exit 1
}

# Step 3: Create database
Write-Host "3. Creando base de datos..." -ForegroundColor Yellow
try {
    $result = psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE hotel_pms;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Base de datos hotel_pms creada" -ForegroundColor Green
    } else {
        Write-Host "Base de datos ya existe" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error creando base de datos" -ForegroundColor Yellow
}

# Step 4: Test connection
Write-Host "4. Probando conexion..." -ForegroundColor Yellow
try {
    $result = psql -U postgres -h localhost -p 5432 -d hotel_pms -c "SELECT current_database();" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Conexion exitosa" -ForegroundColor Green
    } else {
        throw "Connection failed"
    }
} catch {
    Write-Host "Error conectando a la base de datos" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Configuracion completada!" -ForegroundColor Green
Write-Host "Credenciales: admin@hotel.com / admin123" -ForegroundColor Cyan
Write-Host "Instala Node.js y ejecuta: npm install && npm run dev" -ForegroundColor Yellow

