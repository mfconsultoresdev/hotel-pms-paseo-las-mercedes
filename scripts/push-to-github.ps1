# 🚀 SCRIPT PARA HACER PUSH A GITHUB
# Este script conecta tu repositorio local con GitHub y hace push

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl,
    [string]$Branch = "main"
)

Write-Host "🚀 CONECTANDO CON GITHUB..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: No se encontró package.json. Ejecuta este script desde el directorio raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar que Git esté disponible
try {
    $gitVersion = git --version
    Write-Host "✅ Git encontrado: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Git no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "   Instala Git desde: https://git-scm.com/" -ForegroundColor Yellow
    exit 1
}

# Verificar que el repositorio Git exista
if (-not (Test-Path ".git")) {
    Write-Host "❌ ERROR: No se encontró repositorio Git. Ejecuta primero: .\scripts\create-github-repo.ps1" -ForegroundColor Red
    exit 1
}

Write-Host ""

# PASO 1: Verificar URL del repositorio
Write-Host "🔗 PASO 1: Verificando URL del repositorio..." -ForegroundColor Yellow
if ($RepoUrl -notmatch "https://github\.com/.*/.*\.git") {
    Write-Host "   ⚠️  ADVERTENCIA: La URL no parece ser de GitHub" -ForegroundColor Yellow
    Write-Host "   URL proporcionada: $RepoUrl" -ForegroundColor Gray
}

Write-Host "   ✅ URL del repositorio: $RepoUrl" -ForegroundColor Green

# PASO 2: Verificar remotes existentes
Write-Host "📍 PASO 2: Verificando remotes existentes..." -ForegroundColor Yellow
$remotes = git remote -v

if ($remotes) {
    Write-Host "   📍 Remotes configurados:" -ForegroundColor Cyan
    $remotes | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
    
    # Preguntar si quiere reemplazar
    $replace = Read-Host "   ¿Quieres reemplazar el remote 'origin'? (s/N)"
    if ($replace -eq "s" -or $replace -eq "S") {
        Write-Host "   🔄 Reemplazando remote origin..." -ForegroundColor Cyan
        git remote remove origin
        Write-Host "   ✅ Remote origin removido" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Operación cancelada" -ForegroundColor Yellow
        exit 0
    }
}

# PASO 3: Agregar remote origin
Write-Host "🔗 PASO 3: Agregando remote origin..." -ForegroundColor Yellow
git remote add origin $RepoUrl
Write-Host "   ✅ Remote origin agregado: $RepoUrl" -ForegroundColor Green

# PASO 4: Verificar que el remote se agregó correctamente
Write-Host "✅ PASO 4: Verificando remote..." -ForegroundColor Yellow
$newRemotes = git remote -v
Write-Host "   📍 Remotes actuales:" -ForegroundColor Cyan
$newRemotes | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }

# PASO 5: Cambiar a rama main
Write-Host "🌿 PASO 5: Configurando rama principal..." -ForegroundColor Yellow
git branch -M $Branch
Write-Host "   ✅ Rama principal configurada: $Branch" -ForegroundColor Green

# PASO 6: Verificar estado del repositorio
Write-Host "📊 PASO 6: Verificando estado del repositorio..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "   📝 Archivos modificados detectados:" -ForegroundColor Cyan
    $status | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
    
    $add = Read-Host "   ¿Quieres agregar estos cambios antes del push? (s/N)"
    if ($add -eq "s" -or $add -eq "S") {
        Write-Host "   📦 Agregando cambios..." -ForegroundColor Cyan
        git add .
        
        $commitMsg = Read-Host "   Mensaje de commit (Enter para usar el predeterminado)"
        if ([string]::IsNullOrWhiteSpace($commitMsg)) {
            $commitMsg = "🚀 Preparar para push a GitHub"
        }
        
        git commit -m $commitMsg
        Write-Host "   ✅ Cambios agregados y commit realizados" -ForegroundColor Green
    }
} else {
    Write-Host "   ✅ No hay cambios pendientes" -ForegroundColor Green
}

# PASO 7: Hacer push a GitHub
Write-Host "🚀 PASO 7: Haciendo push a GitHub..." -ForegroundColor Yellow
Write-Host "   📤 Enviando código a: $RepoUrl" -ForegroundColor Cyan

try {
    git push -u origin $Branch
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Push exitoso a GitHub!" -ForegroundColor Green
    } else {
        Write-Host "   ❌ ERROR: Falló el push a GitHub" -ForegroundColor Red
        Write-Host "   Revisa los errores y verifica:" -ForegroundColor Yellow
        Write-Host "   - Que el repositorio exista en GitHub" -ForegroundColor Gray
        Write-Host "   - Que tengas permisos de escritura" -ForegroundColor Gray
        Write-Host "   - Que tu token de acceso sea válido" -ForegroundColor Gray
        exit 1
    }
} catch {
    Write-Host "   ❌ ERROR: Excepción durante el push" -ForegroundColor Red
    Write-Host "   Detalles: $($_.Exception.Message)" -ForegroundColor Gray
    exit 1
}

# PASO 8: Verificar estado final
Write-Host "🔍 PASO 8: Verificando estado final..." -ForegroundColor Yellow
$finalStatus = git status
Write-Host "   📊 Estado del repositorio:" -ForegroundColor Cyan
Write-Host "   $finalStatus" -ForegroundColor Gray

Write-Host ""
Write-Host "🎉 ¡REPOSITORIO CONECTADO EXITOSAMENTE!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

# PASO 9: Instrucciones para deploy
Write-Host "📋 PRÓXIMOS PASOS PARA DEPLOY:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1️⃣  Tu código ya está en GitHub: $RepoUrl" -ForegroundColor Green

Write-Host ""
Write-Host "2️⃣  Ahora puedes hacer deploy en Vercel:" -ForegroundColor Cyan
Write-Host "   - Ve a [vercel.com](https://vercel.com)" -ForegroundColor Gray
Write-Host "   - Importa tu repositorio de GitHub" -ForegroundColor Gray
Write-Host "   - Haz el primer deploy" -ForegroundColor Gray

Write-Host ""
Write-Host "3️⃣  O ejecuta el script de deploy automático:" -ForegroundColor Cyan
Write-Host "   .\scripts\deploy-vercel.ps1" -ForegroundColor Gray

Write-Host ""
Write-Host "4️⃣  Para futuros cambios:" -ForegroundColor Cyan
Write-Host "   git add ." -ForegroundColor White
Write-Host "   git commit -m 'Tu mensaje'" -ForegroundColor White
Write-Host "   git push origin $Branch" -ForegroundColor White

Write-Host ""
Write-Host "📚 Para más detalles, consulta:" -ForegroundColor Green
Write-Host "   - README.md" -ForegroundColor Gray
Write-Host "   - GUIA_DEPLOY_COMPLETA_VERCEL_SUPABASE.md" -ForegroundColor Gray

Write-Host ""
Write-Host "🚀 ¡Tu Hotel PMS está listo para el deploy en la nube!" -ForegroundColor Green
