import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Configuración optimizada para serverless (Vercel)
    const options = {
      serverSelectionTimeoutMS: 30000, // Timeout después de 30s (era 10s por defecto)
      socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
      maxPoolSize: 10, // Máximo 10 conexiones en el pool
      minPoolSize: 2, // Mínimo 2 conexiones siempre activas
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    
    console.log('✅ MongoDB conectado exitosamente');
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    console.error('🔍 URI:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@')); // Ocultar password
    
    // En producción, no salir del proceso (Vercel maneja esto)
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    } else {
      throw error; // Lanzar error para que Vercel lo capture
    }
  }
};

// Manejar eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('🔌 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected from MongoDB');
});

// Cerrar conexión cuando la app se cierra (útil para local)
if (process.env.NODE_ENV !== 'production') {
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed through app termination');
    process.exit(0);
  });
}

export default connectDB; 