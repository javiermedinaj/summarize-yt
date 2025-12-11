import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde la carpeta padre
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const testConnection = async () => {
  try {
    console.log('🔄 Intentando conectar a MongoDB...');
    console.log('📝 URI:', process.env.MONGODB_URI ? 'Encontrada' : 'NO encontrada');
    
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB conectado exitosamente');
    console.log('📊 Base de datos:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
    await mongoose.connection.close();
    console.log('👋 Conexión cerrada correctamente');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:');
    console.error('Mensaje:', error.message);
    process.exit(1);
  }
};

testConnection();