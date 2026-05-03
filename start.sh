#!/bin/sh
set -e

echo "Installing server dependencies..."
cd server
npm ci

echo "Starting server..."
npm start
