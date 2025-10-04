#!/bin/bash

# Full-Stack App Setup Script
echo "🚀 Setting up Full-Stack Web App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server && npm install && cd ..

# Create environment files
echo "⚙️ Setting up environment files..."

# Client environment
if [ ! -f "client/.env" ]; then
    cp client/env.example client/.env
    echo "✅ Created client/.env from example"
else
    echo "⚠️ client/.env already exists"
fi

# Server environment
if [ ! -f "server/.env" ]; then
    cp server/env.example server/.env
    echo "✅ Created server/.env from example"
else
    echo "⚠️ server/.env already exists"
fi

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
cd server && npx prisma generate && cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update your environment variables in client/.env and server/.env"
echo "2. Set up your PostgreSQL database"
echo "3. Run 'npm run db:push' to create database tables"
echo "4. Run 'npm run dev' to start both frontend and backend"
echo ""
echo "🔗 Useful commands:"
echo "  npm run dev          - Start development servers"
echo "  npm run build        - Build for production"
echo "  npm run db:push      - Push database schema"
echo "  npm run db:studio    - Open Prisma Studio"
echo "  docker-compose up    - Start PostgreSQL with Docker"
