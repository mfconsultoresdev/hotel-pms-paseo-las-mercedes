# Script para agregar PostgreSQL y Node.js al PATH del sistema
Write-Host "Agregando PostgreSQL y Node.js al PATH del sistema..." -ForegroundColor Green
Write-Host ""

# Obtener el PATH actual
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")

# Rutas a agregar
$postgresPath = "C:\Program Files\PostgreSQL\17\bin"
$nodejsPath = "C:\Program Files\nodejs"

# Verificar si ya están en el PATH
$postgresInPath = $currentPath -like "*$postgresPath*"
$nodejsInPath = $currentPath -like "*$nodejsPath*"

if ($postgresInPath) {
    Write-Host "PostgreSQL ya esta en el PATH del sistema" -ForegroundColor Green
} else {
    Write-Host "Agregando PostgreSQL al PATH del sistema..." -ForegroundColor Yellow
    $newPath = "$currentPath;$postgresPath"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
    Write-Host "PostgreSQL agregado al PATH del sistema" -ForegroundColor Green
}

if ($nodejsInPath) {
    Write-Host "Node.js ya esta en el PATH del sistema" -ForegroundColor Green
} else {
    Write-Host "Agregando Node.js al PATH del sistema..." -ForegroundColor Yellow
    $newPath = "$currentPath;$nodejsPath"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
    Write-Host "Node.js agregado al PATH del sistema" -ForegroundColor Green
}

Write-Host ""
Write-Host "PATH del sistema actualizado!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANTE:" -ForegroundColor Yellow
Write-Host "1. Cierra esta ventana de PowerShell" -ForegroundColor Cyan
Write-Host "2. Abre una NUEVA ventana de PowerShell" -ForegroundColor Cyan
Write-Host "3. Ejecuta: scripts\verificar-instalacion.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Esto es necesario para que los cambios en el PATH surtan efecto" -ForegroundColor Yellow

