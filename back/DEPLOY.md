# Despliegue en Vercel

## Pasos para desplegar:

### 1. Instalar Vercel CLI (si no lo tienes)
```bash
npm install -g vercel
```

### 2. Desde la carpeta `back`, ejecutar:
```bash
cd back
vercel login
vercel
```

### 3. Configurar variables de entorno en Vercel:
- Ve a tu proyecto en vercel.com
- En Settings > Environment Variables, añade:
  - `OPENAI_API_KEY`: Tu clave de OpenAI
  - `NODE_ENV`: production
  - `ALLOWED_ORIGINS`: Los orígenes permitidos para CORS (ej: https://tu-frontend.vercel.app)

### 4. Redeploy después de configurar las variables:
```bash
vercel --prod
```

## Notas importantes:
- El endpoint será: `https://tu-proyecto.vercel.app/api/...`
- Asegúrate de actualizar las URLs en tu frontend
- Las variables de entorno deben configurarse en el dashboard de Vercel

## Estructura de archivos añadidos:
- `vercel.json`: Configuración de Vercel
- `.vercelignore`: Archivos a ignorar en el despliegue
- `index.js`: Modificado para compatibilidad con Vercel
- `package.json`: Añadido motor de Node.js
