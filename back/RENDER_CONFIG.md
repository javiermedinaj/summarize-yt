# 🚀 Configuración de Variables de Entorno en Render

## 📋 Variables necesarias

Ve a tu servicio en Render → Environment → Add Environment Variables

### Variables obligatorias:

```env
# MongoDB
MONGODB_URI=tu_conexion_mongodb_aqui

# OpenAI
OPENAI_API_KEY=tu_api_key_aqui

# CORS - Permitir frontend local Y producción
ALLOWED_ORIGINS=http://localhost:5173,https://tu-frontend.vercel.app

# Node Environment
NODE_ENV=production
```

## 🔧 Configuración actual del problema

**Tu backend en Render:** `https://summarize-yt-2jqk.onrender.com`

**Tu frontend local:** `http://localhost:5173`

### El problema:
El backend está bloqueando las peticiones porque `localhost:5173` no está en `ALLOWED_ORIGINS`.

### La solución:
En Render, agrega esta variable de entorno:

```
ALLOWED_ORIGINS=http://localhost:5173
```

O si también quieres permitir tu frontend en producción:

```
ALLOWED_ORIGINS=http://localhost:5173,https://tu-frontend-en-vercel.app,*
```

**Nota:** El asterisco `*` permite TODAS las origins (útil para testing, no recomendado en producción real).

## 📝 Pasos para agregar variables en Render:

1. Ve a https://dashboard.render.com
2. Selecciona tu servicio: `summarize-yt-2jqk`
3. Click en **"Environment"** en el menú izquierdo
4. Click en **"Add Environment Variable"**
5. Agrega cada variable con su valor
6. Click en **"Save Changes"**
7. Render redesplegará automáticamente tu servicio

## ✅ Variables que debes tener configuradas:

- [ ] `MONGODB_URI` - Tu conexión a MongoDB Atlas
- [ ] `OPENAI_API_KEY` - Tu API key de OpenAI  
- [ ] `ALLOWED_ORIGINS` - Lista de origins permitidas (separadas por coma)
- [ ] `NODE_ENV` - Debe ser `production`

## 🧪 Cómo probar después de configurar:

1. **Reinicia tu frontend local:**
   ```bash
   cd front
   npm run dev
   ```

2. **Verifica que use la URL correcta:**
   - Abre DevTools (F12)
   - Ve a la pestaña Network
   - Haz una petición
   - Verifica que vaya a: `https://summarize-yt-2jqk.onrender.com`

3. **Si sigue sin funcionar:**
   - Revisa los logs en Render Dashboard
   - Busca mensajes de CORS bloqueados
   - Verifica que las variables se guardaron correctamente

## 🎯 Configuración recomendada para producción:

Cuando despliegues el frontend en Vercel/Netlify:

```env
# En Render (Backend)
ALLOWED_ORIGINS=https://tu-app.vercel.app,http://localhost:5173

# En Vercel (Frontend)  
VITE_API_URL=https://summarize-yt-2jqk.onrender.com
```

## 🐛 Troubleshooting

### Error: "Failed to fetch"
**Causa:** Frontend no puede conectar con backend
**Solución:** Verifica que `.env.production` tenga la URL correcta de Render

### Error: "Not allowed by CORS"
**Causa:** Backend rechaza peticiones del frontend
**Solución:** Agrega el origin del frontend a `ALLOWED_ORIGINS` en Render

### Error: "Network error"
**Causa:** El servicio de Render está dormido (free tier)
**Solución:** Espera 30-60s para que despierte, luego reintenta

