# 🚀 SCRIPT DE DEPLOY AUTOMÁTICO PARA VERCEL
# Este script automatiza algunos pasos del deploy en Vercel

param(
    [string]$CommitMessage = "Deploy automático a Vercel",
    [switch]$SkipBuild,
    [switch]$SkipGit
)

Write-Host "🚀 INICIANDO PROCESO DE DEPLOY A VERCEL..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: No se encontró package.json. Ejecuta este script desde el directorio raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar que Git esté disponible
if (-not $SkipGit) {
    try {
        $gitVersion = git --version
        Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ ERROR: Git no está instalado o no está en el PATH" -ForegroundColor Red
        exit 1
    }
}

# Verificar que Node.js esté disponible
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

# Verificar que npm esté disponible
try {
    $npmVersion = npm --version
    Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: npm no está instalado o no está en el PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""

# PASO 1: Verificar dependencias
Write-Host "📦 PASO 1: Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "   Instalando dependencias..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: Falló la instalación de dependencias" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "   ✅ Dependencias ya instaladas" -ForegroundColor Green
}

# PASO 2: Generar cliente Prisma
Write-Host "🗄️ PASO 2: Generando cliente Prisma..." -ForegroundColor Yellow
try {
    npx prisma generate
    Write-Host "   ✅ Cliente Prisma generado" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  ADVERTENCIA: No se pudo generar el cliente Prisma" -ForegroundColor Yellow
}

# PASO 3: Build del proyecto
if (-not $SkipBuild) {
    Write-Host "🔨 PASO 3: Construyendo proyecto..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: Falló el build del proyecto" -ForegroundColor Red
        Write-Host "   Revisa los errores y ejecuta 'npm run build' manualmente" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "   ✅ Proyecto construido exitosamente" -ForegroundColor Green
} else {
    Write-Host "🔨 PASO 3: Build omitido (--SkipBuild)" -ForegroundColor Yellow
}

# PASO 4: Git operations
if (-not $SkipGit) {
    Write-Host "📱 PASO 4: Operaciones de Git..." -ForegroundColor Yellow
    
    # Verificar estado de Git
    $gitStatus = git status --porcelain
    if ($gitStatus) {
        Write-Host "   Archivos modificados detectados:" -ForegroundColor Cyan
        $gitStatus | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
        
        # Agregar todos los cambios
        Write-Host "   Agregando cambios..." -ForegroundColor Cyan
        git add .
        
        # Commit
        Write-Host "   Haciendo commit..." -ForegroundColor Cyan
        git commit -m $CommitMessage
        
        # Push
        Write-Host "   Haciendo push..." -ForegroundColor Cyan
        git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Cambios enviados a GitHub" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  ADVERTENCIA: Falló el push a GitHub" -ForegroundColor Yellow
        }
    } else {
        Write-Host "   ✅ No hay cambios pendientes en Git" -ForegroundColor Green
    }
} else {
    Write-Host "📱 PASO 4: Operaciones de Git omitidas (--SkipGit)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 PROCESO COMPLETADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# PASO 5: Instrucciones para completar el deploy
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS PARA COMPLETAR EL DEPLOY:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1️⃣  Ve a [supabase.com](https://supabase.com) y crea un proyecto:" -ForegroundColor Cyan
Write-Host "   - Crea cuenta con GitHub" -ForegroundColor Gray
Write-Host "   - Crea proyecto: hotel-pms-production" -ForegroundColor Gray
Write-Host "   - Anota las credenciales de la base de datos" -ForegroundColor Gray

Write-Host ""
Write-Host "2️⃣  Ve a [vercel.com](https://vercel.com) y conecta tu repositorio:" -ForegroundColor Cyan
Write-Host "   - Crea cuenta con GitHub" -ForegroundColor Gray
Write-Host "   - Importa tu repositorio" -ForegroundColor Gray
Write-Host "   - Haz el primer deploy" -ForegroundColor Gray

Write-Host ""
Write-Host "3️⃣  Configura las variables de entorno en Vercel:" -ForegroundColor Cyan
Write-Host "   - DATABASE_URL (desde Supabase)" -ForegroundColor Gray
Write-Host "   - NEXTAUTH_SECRET, JWT_SECRET" -ForegroundColor Gray
Write-Host "   - NEXTAUTH_URL, NODE_ENV" -ForegroundColor Gray

Write-Host ""
Write-Host "4️⃣  Haz redeploy en Vercel después de configurar las variables" -ForegroundColor Cyan

Write-Host ""
Write-Host "📚 Para más detalles, consulta: GUIA_DEPLOY_COMPLETA_VERCEL_SUPABASE.md" -ForegroundColor Green
Write-Host "⏱️  Tiempo estimado para completar: 30-45 minutos" -ForegroundColor Green

Write-Host ""
Write-Host "🚀 ¡Tu Hotel PMS estará funcionando en la nube pronto!" -ForegroundColor Green
