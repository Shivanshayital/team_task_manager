# Multi-stage build for Team Task Manager

# Stage 1: Build client
FROM node:22-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# Stage 2: Prepare server
FROM node:22-alpine AS server-builder
WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci --omit=dev

# Stage 3: Runtime
FROM node:22-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy built client
COPY --from=client-builder /app/client/dist ./client/dist

# Copy server
COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY server/ ./server/

EXPOSE 5000

CMD ["node", "server/server.js"]
