import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables FIRST before importing anything else
dotenv.config({ path: join(__dirname, '.env') });

// Debug: Verify env variables are loaded
console.log('🔑 TRANSCRIPT_API_KEY loaded:', process.env.TRANSCRIPT_API_KEY ? 'Yes ✅' : 'No ❌');

import app from './server.js';

const PORT = process.env.PORT || 5000;

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

// Para Vercel
export default app;