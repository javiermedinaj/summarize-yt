# Multi-stage build para optimizar tamaño
FROM node:18-bullseye as builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./

# Instalar pnpm y dependencias
RUN npm install -g pnpm && \
    pnpm install --no-frozen-lockfile

# Stage de producción
FROM node:18-bullseye

WORKDIR /app

# Instalar dependencias del sistema necesarias para Puppeteer/Chromium
# Usando --no-install-recommends para reducir tamaño y evitar dependencias problemáticas
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    chromium-sandbox \
    libnss3 \
    libxss1 \
    libxtst6 \
    fonts-liberation \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Instalar pnpm
RUN npm install -g pnpm

# Copiar node_modules del builder
COPY --from=builder /app/node_modules ./node_modules

# Copiar código de la aplicación
COPY . .

# Crear directorio para resultados si no existe
RUN mkdir -p /app/results

# Configurar permisos de Chromium sandbox
RUN chmod 4755 /usr/lib/chromium/chrome-sandbox

# Variables de entorno
ENV NODE_ENV=production
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROME_EXECUTABLE_PATH=/usr/bin/chromium

EXPOSE 5000

CMD ["node", "index.js"]
