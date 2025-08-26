# 🔗 INSTRUCCIONES PARA CONECTAR CON GITHUB

## 📋 **PASOS PARA SUBIR A GITHUB ANTES DE VERCEL**

### **PASO 1: Crear repositorio en GitHub**

1. **Ve a [github.com](https://github.com)**
2. **Haz clic en "New repository"** (botón verde)
3. **Configura el repositorio:**
   - **Repository name**: `hotel-pms-paseo-las-mercedes`
   - **Description**: `Sistema de Gestión Hotelera (PMS) - Hotel Paseo Las Mercedes`
   - **Visibility**: `Public` (recomendado para proyectos de código abierto)
   - **✅ Add a README file** (ya lo tienes)
   - **✅ Add .gitignore** (ya lo tienes)
   - **✅ Choose a license** (selecciona MIT License)
4. **Haz clic en "Create repository"**

### **PASO 2: Conectar tu repositorio local con GitHub**

**IMPORTANTE:** Reemplaza `[TU-USUARIO]` con tu nombre de usuario de GitHub

```bash
# Agregar el repositorio remoto de GitHub
git remote add origin https://github.com/[TU-USUARIO]/hotel-pms-paseo-las-mercedes.git

# Verificar que se agregó correctamente
git remote -v

# Cambiar la rama principal a 'main' (estándar de GitHub)
git branch -M main

# Hacer push al repositorio de GitHub
git push -u origin main
```

### **PASO 3: Verificar la conexión**

1. **Ve a tu repositorio en GitHub**
2. **Verifica que todos los archivos estén ahí**
3. **Verifica que el README.md se muestre correctamente**

---

## 🚀 **DESPUÉS DE CONECTAR CON GITHUB**

### **Ahora sí puedes proceder con Vercel:**

1. **Ve a [vercel.com](https://vercel.com)**
2. **Crea cuenta con GitHub**
3. **"New Project" → Selecciona tu repositorio**
4. **Vercel detectará Next.js automáticamente**
5. **Configura las variables de entorno**
6. **¡Deploy automático!**

---

## 🔍 **VERIFICACIONES IMPORTANTES**

### **✅ Antes de conectar con GitHub:**
- [x] Repositorio Git inicializado
- [x] Archivos agregados al staging
- [x] Primer commit realizado
- [x] README.md creado
- [x] .gitignore configurado

### **✅ Después de conectar con GitHub:**
- [ ] Repositorio creado en GitHub
- [ ] Repositorio remoto agregado localmente
- [ ] Push exitoso a GitHub
- [ ] Archivos visibles en GitHub
- [ ] README.md se muestra correctamente

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Error: "remote origin already exists"**
```bash
# Remover el remote existente
git remote remove origin

# Agregar el nuevo remote
git remote add origin https://github.com/[TU-USUARIO]/hotel-pms-paseo-las-mercedes.git
```

### **Error: "Authentication failed"**
- Verifica que tu usuario y contraseña de GitHub sean correctos
- Considera usar un token de acceso personal (PAT) en lugar de contraseña

### **Error: "Repository not found"**
- Verifica que el nombre del repositorio sea exacto
- Verifica que tengas permisos para acceder al repositorio

---

## 📚 **COMANDOS GIT ÚTILES**

```bash
# Ver estado del repositorio
git status

# Ver commits realizados
git log --oneline

# Ver remotes configurados
git remote -v

# Ver ramas
git branch -a

# Hacer push de cambios
git push origin main

# Hacer pull de cambios
git pull origin main
```

---

## 🎯 **RESUMEN DEL FLUJO**

1. **✅ Repositorio local configurado** (COMPLETADO)
2. **🔄 Crear repositorio en GitHub** (PENDIENTE)
3. **🔄 Conectar local con GitHub** (PENDIENTE)
4. **🔄 Hacer push a GitHub** (PENDIENTE)
5. **🔄 Configurar Vercel** (PENDIENTE)
6. **🔄 Deploy automático** (PENDIENTE)

---

**🚀 ¡Una vez que completes estos pasos, tu Hotel PMS estará listo para deploy en Vercel!**
