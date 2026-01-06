// Script simple para probar la conexión al backend en Render
const API_URL = 'https://summarize-yt-2jqk.onrender.com';

console.log('🧪 Probando conexión al backend en Render...\n');
console.log(`📡 URL: ${API_URL}\n`);

// Test 1: Health check básico
console.log('Test 1: Health check básico...');
fetch(`${API_URL}/`)
  .then(res => {
    console.log(`✅ Respuesta: ${res.status} ${res.statusText}`);
    return res.text();
  })
  .then(data => {
    console.log(`📄 Body: ${data.substring(0, 100)}...\n`);
  })
  .catch(err => {
    console.log(`❌ Error: ${err.message}\n`);
  });

// Test 2: CORS preflight
setTimeout(() => {
  console.log('Test 2: Probando CORS desde localhost...');
  fetch(`${API_URL}/api/video/extract-summary`, {
    method: 'OPTIONS',
    headers: {
      'Origin': 'http://localhost:5173',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  })
    .then(res => {
      console.log(`✅ CORS Preflight: ${res.status} ${res.statusText}`);
      console.log(`✅ CORS Headers:`, {
        'access-control-allow-origin': res.headers.get('access-control-allow-origin'),
        'access-control-allow-methods': res.headers.get('access-control-allow-methods')
      });
    })
    .catch(err => {
      console.log(`❌ CORS Error: ${err.message}`);
    });
}, 1000);

console.log('\n💡 Tip: Si ves errores de CORS, ve a Render y agrega:');
console.log('   ALLOWED_ORIGINS=http://localhost:5173');

