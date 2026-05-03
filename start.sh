#!/bin/sh
set -e

echo "Preparing application..."

# Install server dependencies
echo "Installing server dependencies..."
cd /app/server
npm ci

# Go back to app root and ensure client build exists
echo "Checking client build..."
cd /app
if [ ! -d "client/dist" ]; then
  echo "Building client..."
  cd client
  npm ci
  npm run build
  cd /app
fi

# Start the server
echo "Starting server..."
cd server
exec node server.js


