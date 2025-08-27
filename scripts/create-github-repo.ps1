# 🚀 SCRIPT PARA CREAR REPOSITORIO EN GITHUB
# Este script automatiza la creación del repositorio y la primera subida

param(
    [string]$RepoName = "hotel-pms-paseo-las-mercedes",
    [string]$Description = "Sistema de Gestión Hotelera (PMS) - Hotel Paseo Las Mercedes",
    [switch]$SkipGit,
    [switch]$SkipRemote
)

Write-Host "🚀 CREANDO REPOSITORIO EN GITHUB..." -ForegroundColor Green
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
        Write-Host "   Instala Git desde: https://git-scm.com/" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""

# PASO 1: Verificar estado de Git
Write-Host "📱 PASO 1: Verificando estado de Git..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "   ✅ Repositorio Git ya existe" -ForegroundColor Green
    
    # Verificar si ya tiene remote
    $remotes = git remote -v
    if ($remotes) {
        Write-Host "   📍 Remotes configurados:" -ForegroundColor Cyan
        $remotes | ForEach-Object { Write-Host "     $_" -ForegroundColor Gray }
        
        if (-not $SkipRemote) {
            Write-Host "   ⚠️  El repositorio ya tiene remotes configurados" -ForegroundColor Yellow
            $continue = Read-Host "   ¿Quieres continuar? (s/N)"
            if ($continue -ne "s" -and $continue -ne "S") {
                Write-Host "   Operación cancelada" -ForegroundColor Yellow
                exit 0
            }
        }
    }
} else {
    Write-Host "   🔧 Inicializando repositorio Git..." -ForegroundColor Cyan
    git init
    Write-Host "   ✅ Repositorio Git inicializado" -ForegroundColor Green
}

# PASO 2: Crear .gitignore si no existe
Write-Host "📝 PASO 2: Configurando .gitignore..." -ForegroundColor Yellow
if (-not (Test-Path ".gitignore")) {
    Write-Host "   📝 Creando .gitignore..." -ForegroundColor Cyan
    
    @"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# Database
*.db
*.sqlite
*.sqlite3

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
*.tmp
*.temp
*.bak
*.backup

# Backup files
*.tar.gz
*.zip
*.rar

# Local development
.local/
local/
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    
    Write-Host "   ✅ .gitignore creado" -ForegroundColor Green
} else {
    Write-Host "   ✅ .gitignore ya existe" -ForegroundColor Green
}

# PASO 3: Crear README.md si no existe
Write-Host "📖 PASO 3: Configurando README.md..." -ForegroundColor Yellow
if (-not (Test-Path "README.md")) {
    Write-Host "   📝 Creando README.md..." -ForegroundColor Cyan
    
    @"
# 🏨 Hotel PMS - Paseo Las Mercedes

Sistema de Gestión Hotelera (PMS) completo y moderno para el Hotel Paseo Las Mercedes.

## 🚀 Características

- **Gestión de Reservas**: Sistema completo de reservas y disponibilidad
- **Gestión de Huéspedes**: Perfiles detallados y historial de estancias
- **Gestión de Habitaciones**: Control de estado y mantenimiento
- **Facturación**: Sistema integrado de facturación y pagos
- **Housekeeping**: Gestión de limpieza y mantenimiento
- **Reportes**: Análisis y reportes en tiempo real
- **Móvil**: Interfaz responsive y PWA
- **Integraciones**: Stripe, PayPal, MercadoPago, etc.

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes, Prisma
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: NextAuth.js
- **UI**: Tailwind CSS, Shadcn/ui
- **Deploy**: Vercel
- **Base de Datos**: Supabase

## 📱 Funcionalidades Principales

### 🏠 Dashboard
- Métricas en tiempo real
- Actividad reciente
- Acciones rápidas
- Estado del hotel

### 👥 Gestión de Huéspedes
- Registro y check-in
- Perfiles detallados
- Historial de estancias
- Preferencias y notas

### 🛏️ Gestión de Habitaciones
- Estado en tiempo real
- Tipos de habitación
- Mantenimiento
- Limpieza

### 📅 Reservas
- Calendario de disponibilidad
- Gestión de reservas
- Check-in/Check-out
- Modificaciones

### 💰 Facturación
- Generación de facturas
- Múltiples métodos de pago
- Historial de transacciones
- Reportes financieros

### 🧹 Housekeeping
- Gestión de tareas
- Estado de limpieza
- Inventario de suministros
- Staff management

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- PostgreSQL (o Supabase)

### Pasos
1. Clonar el repositorio
\`\`\`bash
git clone https://github.com/[TU-USUARIO]/$RepoName.git
cd $RepoName
\`\`\`

2. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

3. Configurar variables de entorno
\`\`\`bash
cp env.example .env.local
# Editar .env.local con tus credenciales
\`\`\`

4. Configurar base de datos
\`\`\`bash
npx prisma generate
npx prisma db push
\`\`\`

5. Ejecutar en desarrollo
\`\`\`bash
npm run dev
\`\`\`

## 🌐 Deploy

### Vercel + Supabase (Recomendado)
- **Hosting**: Vercel (gratis)
- **Base de Datos**: Supabase (gratis)
- **Guía completa**: [Ver documentación de deploy](GUIA_DEPLOY_COMPLETA_VERCEL_SUPABASE.md)

### Script automático
\`\`\`powershell
.\scripts\deploy-vercel.ps1
\`\`\`

## 📚 Documentación

- [Guía de Deploy](GUIA_DEPLOY_COMPLETA_VERCEL_SUPABASE.md)
- [Checklist de Deploy](CHECKLIST_DEPLOY_VERCEL.md)
- [Guía Gratuita](GUIA_DEPLOY_GRATUITO.md)
- [Variables de Entorno](env.vercel.example)

## 🔧 Scripts Disponibles

- \`npm run dev\` - Desarrollo
- \`npm run build\` - Build de producción
- \`npm run start\` - Servidor de producción
- \`npm run lint\` - Linting
- \`npm run test\` - Tests

## 📊 Estado del Proyecto

- ✅ **FASE 1**: Estructura base y autenticación
- ✅ **FASE 2**: Gestión de huéspedes y habitaciones
- ✅ **FASE 3**: Sistema de reservas
- ✅ **FASE 4**: Facturación y pagos
- ✅ **FASE 5**: Housekeeping
- ✅ **FASE 6**: Reportes y analytics
- ✅ **FASE 7**: Integraciones de terceros
- ✅ **FASE 8**: Seguridad y compliance
- ✅ **FASE 9**: Mobile optimization
- ✅ **FASE 10**: Testing y QA
- ✅ **FASE 11**: Monitoreo y observabilidad
- 🚧 **FASE 12**: Deploy y producción

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (\`git checkout -b feature/AmazingFeature\`)
3. Commit tus cambios (\`git commit -m 'Add some AmazingFeature'\`)
4. Push a la rama (\`git push origin feature/AmazingFeature\`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

- **Desarrollador**: [Tu Nombre]
- **Email**: [tu-email@ejemplo.com]
- **Proyecto**: [https://github.com/[TU-USUARIO]/$RepoName](https://github.com/[TU-USUARIO]/$RepoName)

## 🙏 Agradecimientos

- Next.js por el framework increíble
- Vercel por el hosting gratuito
- Supabase por la base de datos gratuita
- La comunidad de desarrolladores

---

**🏨 ¡Tu Hotel PMS estará funcionando en la nube en menos de 30 minutos!**
"@ | Out-File -FilePath "README.md" -Encoding UTF8
    
    Write-Host "   ✅ README.md creado" -ForegroundColor Green
} else {
    Write-Host "   ✅ README.md ya existe" -ForegroundColor Green
}

# PASO 4: Crear LICENSE si no existe
Write-Host "📜 PASO 4: Configurando LICENSE..." -ForegroundColor Yellow
if (-not (Test-Path "LICENSE")) {
    Write-Host "   📝 Creando LICENSE (MIT)..." -ForegroundColor Cyan
    
    @"
MIT License

Copyright (c) 2024 Hotel Paseo Las Mercedes

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"@ | Out-File -FilePath "LICENSE" -Encoding UTF8
    
    Write-Host "   ✅ LICENSE creado" -ForegroundColor Green
} else {
    Write-Host "   ✅ LICENSE ya existe" -ForegroundColor Green
}

# PASO 5: Agregar archivos al staging
Write-Host "📦 PASO 5: Preparando archivos para commit..." -ForegroundColor Yellow
git add .
Write-Host "   ✅ Archivos agregados al staging" -ForegroundColor Green

# PASO 6: Primer commit
Write-Host "💾 PASO 6: Haciendo primer commit..." -ForegroundColor Yellow
git commit -m "🎉 Initial commit: Hotel PMS - Sistema de Gestión Hotelera

- Sistema completo de gestión hotelera
- Next.js 14 + TypeScript + Prisma
- Interfaz moderna y responsive
- Integración con múltiples servicios
- Listo para deploy en Vercel + Supabase"
Write-Host "   ✅ Primer commit realizado" -ForegroundColor Green

# PASO 7: Instrucciones para crear repositorio en GitHub
Write-Host ""
Write-Host "🎉 CONFIGURACIÓN LOCAL COMPLETADA!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 PRÓXIMOS PASOS PARA CREAR EL REPOSITORIO EN GITHUB:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1️⃣  Ve a [github.com](https://github.com) y crea un nuevo repositorio:" -ForegroundColor Cyan
Write-Host "   - Haz clic en 'New repository'" -ForegroundColor Gray
Write-Host "   - Nombre: $RepoName" -ForegroundColor Gray
Write-Host "   - Descripción: $Description" -ForegroundColor Gray
Write-Host "   - Marca como 'Public' o 'Private'" -ForegroundColor Gray
Write-Host "   - NO inicialices con README, .gitignore o LICENSE" -ForegroundColor Gray
Write-Host "   - Haz clic en 'Create repository'" -ForegroundColor Gray

Write-Host ""
Write-Host "2️⃣  Conecta tu repositorio local con GitHub:" -ForegroundColor Cyan
Write-Host "   - Copia la URL del repositorio (ej: https://github.com/usuario/$RepoName.git)" -ForegroundColor Gray
Write-Host "   - Ejecuta estos comandos:" -ForegroundColor Gray

Write-Host ""
Write-Host "   git remote add origin https://github.com/[TU-USUARIO]/$RepoName.git" -ForegroundColor White
Write-Host "   git branch -M main" -ForegroundColor White
Write-Host "   git push -u origin main" -ForegroundColor White

Write-Host ""
Write-Host "3️⃣  O ejecuta este script después de crear el repositorio:" -ForegroundColor Cyan
Write-Host "   .\scripts\push-to-github.ps1 -RepoUrl 'https://github.com/[TU-USUARIO]/$RepoName.git'" -ForegroundColor Gray

Write-Host ""
Write-Host "📚 Para más detalles, consulta: README.md" -ForegroundColor Green
Write-Host "🚀 ¡Tu Hotel PMS estará en GitHub pronto!" -ForegroundColor Green
