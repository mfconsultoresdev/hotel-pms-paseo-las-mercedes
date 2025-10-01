# Cambiar Branch Principal a Master en GitHub

## Opción A: Desde GitHub Web (Más Fácil)

1. Ve a: https://github.com/mfconsultoresdev/hotel-pms-paseo-las-mercedes
2. Click en **Settings** (Configuración)
3. En el menú izquierdo, click en **Branches**
4. En "Default branch", click en el botón de cambiar (ícono de flechas)
5. Selecciona **master**
6. Click en **Update**
7. Confirma el cambio

## Opción B: Desde Línea de Comandos (Automático)

Ejecutar este comando:

```bash
# Cambiar el branch principal en GitHub
git remote set-head origin master
```

Esto hará que master sea el branch principal.

## Resultado

Después del cambio:
- ✅ `master` será el branch principal
- ✅ Vercel detectará automáticamente `master` como branch de producción
- ✅ Podrás eliminar `clean-deploy` si quieres (ya no lo necesitas)

