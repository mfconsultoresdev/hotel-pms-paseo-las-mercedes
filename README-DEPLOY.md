# 🚀 DEPLOY RÁPIDO - HOTEL PMS

## 📋 **RESUMEN EN 5 MINUTOS**

Tu Hotel PMS está listo para deploy en la nube. Sigue estos pasos simples:

1. **Supabase** → Crear base de datos (5 min)
2. **Vercel** → Conectar GitHub y hacer deploy (10 min)  
3. **Variables** → Configurar credenciales (10 min)
4. **Redeploy** → ¡Listo! (5 min)

**⏱️ Total: 30 minutos | 💰 Costo: $0/mes**

---

## 🚀 **INICIO RÁPIDO**

### **Opción 1: Script Automático (Recomendado)**
```powershell
# Desde PowerShell en el directorio app/
.\scripts\deploy-vercel.ps1
```

### **Opción 2: Manual**
```bash
# Verificar que todo funcione
npm run build

# Subir cambios a GitHub
git add .
git commit -m "Preparar para deploy"
git push origin main
```

---

## 📚 **DOCUMENTACIÓN COMPLETA**

- **📖 [Guía Completa](GUIA_DEPLOY_COMPLETA_VERCEL_SUPABASE.md)** - Paso a paso detallado
- **📋 [Checklist](CHECKLIST_DEPLOY_VERCEL.md)** - Lista de verificación
- **💰 [Guía Gratuita](GUIA_DEPLOY_GRATUITO.md)** - Opciones gratuitas
- **⚙️ [Variables de Entorno](env.vercel.example)** - Plantilla de configuración

---

## 🎯 **LO QUE OBTIENES**

- ✅ **Aplicación web** funcionando 24/7
- ✅ **Base de datos** PostgreSQL en la nube
- ✅ **Deploy automático** desde GitHub
- ✅ **SSL/HTTPS** automático
- ✅ **CDN global** para mejor rendimiento
- ✅ **Monitoreo** y logs automáticos
- ✅ **Escalabilidad** automática

---

## 🆘 **PROBLEMAS COMUNES**

### **Build Falla**
```bash
# Verificar localmente
npm run build

# Revisar logs en Vercel
# Verificar variables de entorno
```

### **Base de Datos No Conecta**
- Verificar `DATABASE_URL` en Vercel
- Asegurar que Supabase esté activo
- Verificar contraseña correcta

### **Variables No Se Cargan**
- Configurar en Vercel → Settings → Environment Variables
- Marcar para "Production"
- Hacer redeploy después de cambios

---

## 🔗 **ENLACES ÚTILES**

- **🌐 [Vercel](https://vercel.com)** - Hosting y deploy
- **🗄️ [Supabase](https://supabase.com)** - Base de datos
- **📱 [GitHub](https://github.com)** - Control de versiones
- **📚 [Next.js](https://nextjs.org)** - Framework

---

## 📞 **SOPORTE**

Si tienes problemas:
1. Revisa los logs en Vercel
2. Verifica la documentación oficial
3. Consulta los archivos de este proyecto
4. Revisa la sección de solución de problemas

---

## 🎉 **¡LISTO PARA PRODUCCIÓN!**

Tu Hotel PMS estará funcionando en la nube en menos de 30 minutos.

**🚀 ¡Empieza ahora y ten tu aplicación funcionando hoy mismo!**
