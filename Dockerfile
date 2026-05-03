# Multi-stage build for Team Task Manager

# Stage 1: Build client
FROM node:22-alpine AS client-builder
WORKDIR /app

COPY client/package*.json ./client/
RUN cd client && npm install --omit=dev

COPY client/ ./client/
RUN cd client && npm run build

# Stage 2: Build server
FROM node:22-alpine AS server-builder
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

# Stage 3: Runtime
FROM node:22-alpine
WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy built client from client-builder
COPY --from=client-builder /app/client/dist ./client/dist

# Copy server source and dependencies from server-builder
COPY --from=server-builder /app/server/node_modules ./server/node_modules
COPY server/ ./server/

# Expose port
EXPOSE 5000

# Start server
CMD ["node", "server/server.js"]
