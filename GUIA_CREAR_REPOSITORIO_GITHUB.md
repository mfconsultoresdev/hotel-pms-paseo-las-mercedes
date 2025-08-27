# 🚀 GUÍA COMPLETA: CREAR REPOSITORIO EN GITHUB

## 📋 **RESUMEN RÁPIDO**
- **GitHub**: Plataforma de control de versiones
- **Repositorio**: Almacena tu código Hotel PMS
- **CI/CD**: Deploy automático desde GitHub
- **Colaboración**: Trabajo en equipo y versionado

---

## 🎯 **OBJETIVOS**
1. ✅ Crear repositorio en GitHub
2. ✅ Subir tu código Hotel PMS
3. ✅ Configurar deploy automático
4. ✅ Preparar para Vercel + Supabase

---

## 🚀 **OPCIÓN 1: SCRIPT AUTOMÁTICO (RECOMENDADO)**

### **Paso 1: Ejecutar script de preparación**
```powershell
# Desde PowerShell en el directorio app/
.\scripts\create-github-repo.ps1
```

Este script:
- ✅ Inicializa repositorio Git local
- ✅ Crea `.gitignore` optimizado
- ✅ Genera `README.md` profesional
- ✅ Crea `LICENSE` MIT
- ✅ Hace primer commit
- ✅ Te guía para crear repositorio en GitHub

### **Paso 2: Crear repositorio en GitHub**
1. Ve a [github.com](https://github.com)
2. Haz clic en **"New repository"**
3. **Repository name**: `hotel-pms-paseo-las-mercedes`
4. **Description**: `Sistema de Gestión Hotelera (PMS) - Hotel Paseo Las Mercedes`
5. **Visibility**: `Public` o `Private`
6. **NO marques** "Add a README file"
7. **NO marques** "Add .gitignore"
8. **NO marques** "Choose a license"
9. Haz clic en **"Create repository"**

### **Paso 3: Conectar con GitHub**
```powershell
# Después de crear el repositorio en GitHub
.\scripts\push-to-github.ps1 -RepoUrl "https://github.com/[TU-USUARIO]/hotel-pms-paseo-las-mercedes.git"
```

---

## 🔧 **OPCIÓN 2: MANUAL PASO A PASO**

### **Paso 1: Verificar Git instalado**
```bash
git --version
# Debe mostrar: git version 2.x.x
```

Si no está instalado:
- **Windows**: [git-scm.com](https://git-scm.com/)
- **macOS**: `brew install git`
- **Linux**: `sudo apt install git`

### **Paso 2: Configurar Git (primera vez)**
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### **Paso 3: Inicializar repositorio local**
```bash
# En el directorio app/
git init
```

### **Paso 4: Crear .gitignore**
```bash
# Crear archivo .gitignore con contenido optimizado
# (Ver contenido en scripts/create-github-repo.ps1)
```

### **Paso 5: Crear README.md**
```bash
# Crear archivo README.md con documentación
# (Ver contenido en scripts/create-github-repo.ps1)
```

### **Paso 6: Crear LICENSE**
```bash
# Crear archivo LICENSE con licencia MIT
# (Ver contenido en scripts/create-github-repo.ps1)
```

### **Paso 7: Primer commit**
```bash
git add .
git commit -m "🎉 Initial commit: Hotel PMS - Sistema de Gestión Hotelera"
```

### **Paso 8: Crear repositorio en GitHub**
1. Ve a [github.com](https://github.com)
2. Haz clic en **"New repository"**
3. **Repository name**: `hotel-pms-paseo-las-mercedes`
4. **Description**: `Sistema de Gestión Hotelera (PMS) - Hotel Paseo Las Mercedes`
5. **Visibility**: `Public` o `Private`
6. Haz clic en **"Create repository"**

### **Paso 9: Conectar repositorio local con GitHub**
```bash
git remote add origin https://github.com/[TU-USUARIO]/hotel-pms-paseo-las-mercedes.git
git branch -M main
git push -u origin main
```

---

## 🔐 **CONFIGURACIÓN DE AUTENTICACIÓN**

### **Opción A: Personal Access Token (Recomendado)**
1. En GitHub → **Settings** → **Developer settings** → **Personal access tokens**
2. **Generate new token** → **Classic**
3. **Note**: `Hotel PMS Deploy`
4. **Expiration**: `90 days` o `No expiration`
5. **Scopes**: Marca `repo` completo
6. **Generate token**
7. **COPIA EL TOKEN** (no lo pierdas)

### **Opción B: SSH Keys**
1. Generar clave SSH:
   ```bash
   ssh-keygen -t ed25519 -C "tu-email@ejemplo.com"
   ```
2. Agregar clave pública a GitHub
3. Usar URL SSH: `git@github.com:usuario/repo.git`

---

## 📁 **ESTRUCTURA DEL REPOSITORIO**

```
hotel-pms-paseo-las-mercedes/
├── 📁 app/                    # Aplicación Next.js
│   ├── 📁 components/        # Componentes React
│   ├── 📁 lib/              # Utilidades y configuraciones
│   ├── 📁 prisma/           # Esquema de base de datos
│   ├── 📁 scripts/          # Scripts de automatización
│   ├── 📄 package.json      # Dependencias
│   ├── 📄 next.config.js    # Configuración Next.js
│   └── 📄 vercel.json       # Configuración Vercel
├── 📁 __tests__/            # Tests automatizados
├── 📄 README.md             # Documentación principal
├── 📄 LICENSE               # Licencia MIT
├── 📄 .gitignore            # Archivos a ignorar
└── 📄 GUIA_DEPLOY_*.md      # Guías de deploy
```

---

## 🚀 **DESPUÉS DE CREAR EL REPOSITORIO**

### **1. Verificar que el código esté en GitHub**
- Ve a tu repositorio: `https://github.com/[USUARIO]/hotel-pms-paseo-las-mercedes`
- Verifica que todos los archivos estén ahí
- Revisa que el README se muestre correctamente

### **2. Configurar GitHub Pages (opcional)**
1. **Settings** → **Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `main` → `/docs`
4. **Save**

### **3. Configurar Topics (recomendado)**
En la página principal del repositorio, agrega topics:
- `hotel-pms`
- `nextjs`
- `typescript`
- `prisma`
- `postgresql`
- `vercel`
- `supabase`

### **4. Configurar descripción del repositorio**
- **About**: Agrega descripción corta
- **Website**: URL de tu aplicación (después del deploy)
- **Topics**: Agrega etiquetas relevantes

---

## 🔄 **FLUJO DE TRABAJO DIARIO**

### **Para hacer cambios:**
```bash
# 1. Hacer cambios en tu código
# 2. Verificar cambios
git status

# 3. Agregar cambios
git add .

# 4. Hacer commit
git commit -m "✨ Agregar nueva funcionalidad"

# 5. Subir a GitHub
git push origin main
```

### **Para actualizar desde GitHub:**
```bash
# Si otros colaboradores hicieron cambios
git pull origin main
```

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Repository already exists"**
- Verifica que no tengas un repositorio con ese nombre
- Usa un nombre diferente o elimina el existente

### **Error: "Authentication failed"**
- Verifica tu token de acceso
- Regenera el token si es necesario
- Asegúrate de que tenga permisos de `repo`

### **Error: "Push failed"**
- Verifica que tengas permisos de escritura
- Asegúrate de que el repositorio exista
- Verifica tu conexión a internet

### **Error: "Branch main not found"**
- Verifica que estés en la rama correcta: `git branch`
- Cambia a main: `git checkout main`

---

## 📚 **RECURSOS ADICIONALES**

### **Documentación oficial:**
- [GitHub Docs](https://docs.github.com/)
- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)

### **Tutoriales:**
- [Git y GitHub para principiantes](https://www.youtube.com/watch?v=SWYqp7iY_Tc)
- [GitHub Pages](https://pages.github.com/)

---

## 🎉 **¡REPOSITORIO CREADO EXITOSAMENTE!**

Una vez que completes todos los pasos:
- ✅ Tu código estará en GitHub
- ✅ Listo para deploy en Vercel
- ✅ Configurado para CI/CD automático
- ✅ Preparado para colaboración

---

## 🚀 **PRÓXIMOS PASOS**

1. **Deploy en Vercel**: [Ver guía](GUIA_DEPLOY_COMPLETA_VERCEL_SUPABASE.md)
2. **Configurar Supabase**: Base de datos en la nube
3. **Dominio personalizado**: Configurar tu dominio
4. **Monitoreo**: Configurar alertas y logs

---

## 📞 **SOPORTE**

Si encuentras problemas:
1. Revisa la documentación oficial de GitHub
2. Verifica que Git esté configurado correctamente
3. Asegúrate de tener permisos en el repositorio
4. Revisa los logs de error

---

## 🚀 **TIEMPO ESTIMADO: 15-20 MINUTOS**

**¡Tu Hotel PMS estará en GitHub en menos de 20 minutos!**

---

## 📋 **CHECKLIST FINAL**

- [ ] ✅ Git instalado y configurado
- [ ] ✅ Repositorio local inicializado
- [ ] ✅ .gitignore creado
- [ ] ✅ README.md creado
- [ ] ✅ LICENSE creado
- [ ] ✅ Primer commit realizado
- [ ] ✅ Repositorio creado en GitHub
- [ ] ✅ Remote origin configurado
- [ ] ✅ Código subido a GitHub
- [ ] ✅ README visible en GitHub
- [ ] ✅ Topics configurados (opcional)

**🎯 ¡Todo listo para el deploy en la nube!**
