
@echo off
chcp 65001 >nul
echo ========================================
echo 🏨 HOTEL PMS - INSTALADOR AUTOMÁTICO
echo ========================================
echo.
echo Este script instalará automáticamente:
echo - Node.js 20.x LTS
echo - Yarn package manager
echo - PostgreSQL 15
echo - Git for Windows
echo.
pause

echo 📦 Descargando Node.js...
curl -L -o nodejs.msi https://nodejs.org/dist/v20.9.0/node-v20.9.0-x64.msi
if %errorlevel% neq 0 (
    echo ❌ Error descargando Node.js
    goto :error
)

echo 🔧 Instalando Node.js...
msiexec /i nodejs.msi /quiet /norestart
if %errorlevel% neq 0 (
    echo ❌ Error instalando Node.js
    goto :error
)

echo 📦 Instalando Yarn...
npm install -g yarn
if %errorlevel% neq 0 (
    echo ❌ Error instalando Yarn
    goto :error
)

echo 📦 Descargando PostgreSQL...
curl -L -o postgresql.exe https://get.enterprisedb.com/postgresql/postgresql-15.4-2-windows-x64.exe
if %errorlevel% neq 0 (
    echo ❌ Error descargando PostgreSQL
    goto :error
)

echo 🗄️ Instalando PostgreSQL...
echo IMPORTANTE: Cuando se abra el instalador:
echo - Usuario: postgres
echo - Contraseña: postgres (o la que prefieras)
echo - Puerto: 5432
echo.
postgresql.exe --mode unattended --unattendedmodeui minimal --superpassword postgres
if %errorlevel% neq 0 (
    echo ⚠️  PostgreSQL requiere instalación manual
    echo Por favor, instala PostgreSQL manualmente desde:
    echo https://www.postgresql.org/download/windows/
    pause
)

echo 📦 Descargando Git...
curl -L -o git.exe https://github.com/git-for-windows/git/releases/download/v2.42.0.windows.2/Git-2.42.0.2-64-bit.exe
if %errorlevel% neq 0 (
    echo ❌ Error descargando Git
    goto :error
)

echo 🔧 Instalando Git...
git.exe /VERYSILENT /NORESTART
if %errorlevel% neq 0 (
    echo ❌ Error instalando Git
    goto :error
)

echo.
echo ✅ INSTALACIÓN COMPLETADA
echo.
echo 📋 PRÓXIMOS PASOS:
echo 1. Reinicia tu computadora
echo 2. Abre Cursor IDE
echo 3. Sigue las instrucciones en README_CURSOR.md
echo.
echo 🔗 DESCARGAS MANUALES SI ES NECESARIO:
echo - Cursor IDE: https://cursor.sh/
echo - Node.js: https://nodejs.org/
echo - PostgreSQL: https://www.postgresql.org/download/windows/
echo.
pause
goto :end

:error
echo.
echo ❌ ERROR EN LA INSTALACIÓN
echo Por favor, instala manualmente los componentes desde:
echo - Node.js: https://nodejs.org/
echo - PostgreSQL: https://www.postgresql.org/download/windows/
echo - Git: https://git-scm.com/download/win
echo - Cursor: https://cursor.sh/
echo.
pause

:end
echo Presiona cualquier tecla para salir...
pause >nul
