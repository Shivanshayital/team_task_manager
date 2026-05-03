#!/bin/sh
set -e

echo "Preparing application..."
cd /app

# Install and build client
echo "Setting up client..."
cd /app/client
npm install --omit=dev

echo "Building client..."
npm run build

# Install server dependencies
echo "Installing server dependencies..."
cd /app/server
npm install --omit=dev

# Start the server
echo "Starting server..."
exec node server.js



