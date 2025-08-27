# Script para preparar build de producción - Hotel PMS
Write-Host "🚀 PREPARANDO BUILD DE PRODUCCIÓN..." -ForegroundColor Green
Write-Host ""

# Verificar que estemos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ No se encontró package.json" -ForegroundColor Red
    Write-Host "   Ejecuta este script desde el directorio app/" -ForegroundColor Yellow
    exit 1
}

# Verificar que las dependencias estén instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        exit 1
    }
}

# Generar cliente Prisma
Write-Host "🔧 Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error generando cliente Prisma" -ForegroundColor Red
    exit 1
}

# Crear build de producción
Write-Host "🏗️  Creando build de producción..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en build" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ BUILD DE PRODUCCIÓN COMPLETADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host "📁 Archivos generados en: .next/" -ForegroundColor Cyan
Write-Host "🚀 Listo para deploy en:" -ForegroundColor Cyan
Write-Host "   - Vercel (recomendado)" -ForegroundColor Yellow
Write-Host "   - Netlify" -ForegroundColor Yellow
Write-Host "   - Railway" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS:" -ForegroundColor Yellow
Write-Host "   1. Configura variables de entorno de producción" -ForegroundColor Cyan
Write-Host "   2. Conecta tu repositorio a la plataforma de deploy" -ForegroundColor Cyan
Write-Host "   3. Configura la base de datos PostgreSQL" -ForegroundColor Cyan
Write-Host "   4. Ejecuta el deploy automático" -ForegroundColor Cyan



