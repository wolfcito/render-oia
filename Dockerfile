# --- Etapa 1: Build del cliente (React) ---
FROM node:18-alpine AS client-builder
WORKDIR /app/client

# Copia package.json y package-lock.json para que npm ci encuentre el lockfile
COPY client/package.json client/package-lock.json ./
RUN npm ci  # Requiere package-lock.json o npm-shrinkwrap.json para funcionar :contentReference[oaicite:0]{index=0}

COPY client/ ./
RUN npm run build

# --- Etapa 2: Build del servidor (Express) ---
FROM node:18-alpine AS server-builder
WORKDIR /app/server

# Igual para el servidor: copiar ambos archivos de dependencias
COPY server/package.json server/package-lock.json ./
RUN npm ci  # Garantiza instalación limpia basada en lockfile :contentReference[oaicite:1]{index=1}

COPY server/ ./
# Copia los archivos estáticos generados por el cliente a public/
COPY --from=client-builder /app/client/build ./public

# --- Etapa final: Imagen de producción ---
FROM node:18-alpine
WORKDIR /app

# Solo copiamos la carpeta preparada en server-builder
COPY --from=server-builder /app/server/ ./

EXPOSE 3000
CMD ["node", "index.js"]
