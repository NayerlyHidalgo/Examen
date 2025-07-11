# 🚀 Guía de Despliegue en Vercel

## 📋 Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub: https://github.com/NayerlyHidalgo/Examen.git
- Variables de entorno configuradas

## 🔧 Configuración de Variables de Entorno en Vercel

### 1. Ir a tu proyecto en Vercel
1. Abrir https://vercel.com/dashboard
2. Seleccionar tu proyecto
3. Ir a **Settings** → **Environment Variables**

### 2. Configurar las siguientes variables:

#### Base de Datos PostgreSQL (Neon)
```
DB_HOST=ep-lively-sun-aacyqxnp-pooler.westus3.azure.neon.tech
DB_PORT=5432
DB_USER=neondb_owner
DB_PASS=npg_of5RCcqbj8Ti
DB_NAME=neondb
DATABASE_URL=postgresql://neondb_owner:npg_of5RCcqbj8Ti@ep-lively-sun-aacyqxnp-pooler.westus3.azure.neon.tech:5432/neondb
```

#### JWT y Autenticación
```
JWT_SECRET=npg_XvWzBkJr49UP
JWT_EXPIRES_IN=3600s
SESSION_SECRET=mi-session-secret-super-seguro-2024
```

#### MongoDB (Atlas)
```
MONGO_URI=mongodb+srv://meliferj1995:M3l5N128.12@clustermongoutenh.m2ekh9a.mongodb.net/
```

#### Email (Nodemailer)
```
MAIL_USER=melifer.j1995@gmail.com
MAIL_PASS=llmm elbg vyac mqrs
```

#### Configuración de Deploy
```
NODE_ENV=production
PORT=3001
USE_HTTPS=true
```

## 🌐 Deploy Manual en Vercel

### Opción 1: Desde GitHub (Recomendado)
1. Ir a https://vercel.com/new
2. Seleccionar **Import Git Repository**
3. Elegir el repositorio: `NayerlyHidalgo/Examen`
4. Configurar:
   - **Framework Preset**: Other
   - **Root Directory**: `blog-backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Opción 2: CLI de Vercel
```bash
# Instalar Vercel CLI
npm install -g vercel

# Navegar al directorio del proyecto
cd "c:\Users\melif\ProyectoFinal\tattoo-shop-backend\blog-backend"

# Iniciar sesión en Vercel
vercel login

# Desplegar
vercel

# Para producción
vercel --prod
```

## 📝 Archivo vercel.json

El proyecto ya incluye un archivo `vercel.json` configurado:

```json
{
  "version": 2,
  "name": "tattoo-shop-frontend",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["views/**", "public/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/css/(.*)",
      "dest": "/public/css/$1"
    },
    {
      "src": "/js/(.*)",
      "dest": "/public/js/$1"
    },
    {
      "src": "/images/(.*)",
      "dest": "/public/images/$1"
    },
    {
      "src": "/productos/(.*)",
      "dest": "/src/main.js"
    },
    {
      "src": "/(.*)",
      "dest": "/src/main.js"
    }
  ]
}
```

## 🔗 URLs del Proyecto

### Desarrollo Local
- **Base**: http://localhost:3001
- **Tienda**: http://localhost:3001/productos/tienda
- **Admin**: http://localhost:3001/productos/admin
- **API**: http://localhost:3001/productos/api

### Producción (Railway)
- **Base**: https://examen-production.up.railway.app
- **Tienda**: https://examen-production.up.railway.app/productos/tienda
- **Admin**: https://examen-production.up.railway.app/productos/admin
- **API**: https://examen-production.up.railway.app/productos/api

### Producción (Vercel)
- **Base**: https://tu-proyecto.vercel.app
- **Tienda**: https://tu-proyecto.vercel.app/productos/tienda
- **Admin**: https://tu-proyecto.vercel.app/productos/admin
- **API**: https://tu-proyecto.vercel.app/productos/api

## 🧪 Verificación del Deploy

### 1. Verificar que el servidor inicie
```bash
# Verificar logs en Vercel
vercel logs
```

### 2. Probar endpoints principales
```bash
# Health check
curl https://tu-proyecto.vercel.app/productos/api/health

# Página principal
curl https://tu-proyecto.vercel.app/productos/

# Tienda pública
curl https://tu-proyecto.vercel.app/productos/tienda
```

### 3. Verificar base de datos
- Conectar a PostgreSQL (Neon)
- Conectar a MongoDB (Atlas)
- Verificar que las tablas/colecciones existan

## 🔧 Troubleshooting

### Error: "Cannot find module"
```bash
# Verificar que todas las dependencias estén instaladas
npm install

# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error: "Database connection failed"
1. Verificar que las variables de entorno estén configuradas correctamente
2. Verificar que las IPs estén permitidas en Neon y Atlas
3. Revisar logs en Vercel

### Error: "Port already in use"
```bash
# Vercel manejará el puerto automáticamente
# No es necesario especificar puerto en producción
```

## 🎯 Pasos Finales

1. **Verificar Deploy**: Abrir la URL de Vercel y comprobar que funciona
2. **Probar Funcionalidades**: 
   - Tienda pública
   - Login/registro
   - Panel admin
   - API endpoints
3. **Verificar Bases de Datos**: Comprobar conexiones a Neon y Atlas
4. **Monitorear**: Revisar logs y métricas en Vercel

## 🌟 Proyecto Completo

✅ **Backend**: NestJS con TypeScript
✅ **Frontend**: Handlebars + Bootstrap
✅ **Base de Datos**: PostgreSQL (Neon) + MongoDB (Atlas)
✅ **Autenticación**: JWT implementado
✅ **Deploy**: Railway + Vercel
✅ **Repositorio**: https://github.com/NayerlyHidalgo/Examen.git

**¡Proyecto listo para evaluación!** 🚀
