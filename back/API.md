# API de Resumen de Videos - Documentación

## 🚀 Rutas Disponibles

### 1. **Extraer y Resumir Video** (Recomendada)
```http
POST /api/video/extract-summary
```

**Descripción**: Extrae los subtítulos del video de YouTube y genera un resumen usando OpenAI.

**Input**:
```json
{
    "videoUrl": "https://www.youtube.com/watch?v=..."
}
```

**Output**:
```json
{
    "success": true,
    "summary": "Resumen generado del video...",
    "videoId": "ID_del_video"
}
```

### 2. **Solo Extraer Subtítulos**
```http
POST /api/video/extract-subtitles
```

**Descripción**: Extrae únicamente los subtítulos del video sin generar resumen.

**Input**:
```json
{
    "videoUrl": "https://www.youtube.com/watch?v=..."
}
```

**Output**:
```json
{
    "success": true,
    "subtitles": "Texto de los subtítulos...",
    "videoId": "ID_del_video"
}
```

## ⚙️ Configuración del Servidor

- **Puerto**: `5000` (por defecto) o el definido en `PORT` en tu archivo `.env`
- **CORS**: Configurado para permitir requests desde:
  - `http://localhost:5173`
  - `https://summarize-ai-yt.vercel.app/`

## 📝 Ejemplos de Uso

### JavaScript/Node.js
```javascript
// Para obtener resumen del video
const response = await fetch('http://localhost:5000/api/video/extract-summary', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        videoUrl: 'https://www.youtube.com/watch?v=tu_video_id'
    })
});

const data = await response.json();
console.log(data.summary); // El resumen del video
```

### Python
```python
import requests

# Para obtener resumen del video
response = requests.post(
    'http://localhost:5000/api/video/extract-summary',
    json={
        'videoUrl': 'https://www.youtube.com/watch?v=tu_video_id'
    },
    headers={'Content-Type': 'application/json'}
)

data = response.json()
print(data['summary'])  # El resumen del video
```

### cURL
```bash
# Para obtener resumen del video
curl -X POST http://localhost:5000/api/video/extract-summary \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://www.youtube.com/watch?v=tu_video_id"}'

# Para obtener solo subtítulos
curl -X POST http://localhost:5000/api/video/extract-subtitles \
  -H "Content-Type: application/json" \
  -d '{"videoUrl": "https://www.youtube.com/watch?v=tu_video_id"}'
```

## 🔧 Códigos de Respuesta

| Código | Descripción |
|--------|-------------|
| `200` | ✅ Éxito - Operación completada correctamente |
| `400` | ❌ Error de validación - URL inválida o faltante |
| `500` | ❌ Error interno del servidor |

## 📋 Respuestas de Error

### Error de Validación (400)
```json
{
    "error": "Validation error message"
}
```

### Error del Servidor (500)
```json
{
    "error": "Error message or 'Failed to process video'"
}
```

## 🚀 Inicio Rápido

1. **Inicia el servidor**:
   ```bash
   npm start
   # o
   node index.js
   ```

2. **Haz una petición de prueba**:
   ```bash
   curl -X POST http://localhost:5000/api/video/extract-summary \
     -H "Content-Type: application/json" \
     -d '{"videoUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"}'
   ```

## 📌 Notas Importantes

- ✅ Solo funciona con videos de YouTube que tengan subtítulos disponibles
- ✅ La URL debe ser una URL válida de YouTube
- ✅ El servicio requiere conexión a internet para acceder a YouTube y OpenAI
- ⚠️ Los videos muy largos pueden tardar más tiempo en procesarse
- ⚠️ Asegúrate de tener configuradas las variables de entorno necesarias (API keys de OpenAI)

## 🔗 Integración con Otras Aplicaciones

Para integrar este servicio con otra aplicación, simplemente usa las rutas mencionadas arriba. El servicio está configurado con CORS para permitir requests desde aplicaciones web.

**URL Base**: `http://localhost:5000` (desarrollo) o tu dominio de producción
