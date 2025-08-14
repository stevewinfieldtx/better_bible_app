#!/bin/bash

# Railway Deployment Script for Better Bible App
# This script helps with common Railway deployment tasks

set -e

echo "🚀 Better Bible App Railway Deployment Script"
echo "=============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please log in to Railway first:"
    railway login
fi

# Function to deploy
deploy() {
    echo "📦 Building and deploying..."
    railway up
    echo "✅ Deployment complete!"
}

# Function to view logs
logs() {
    echo "📋 Viewing logs..."
    railway logs
}

# Function to open Railway dashboard
dashboard() {
    echo "🌐 Opening Railway dashboard..."
    railway open
}

# Function to check status
status() {
    echo "📊 Checking deployment status..."
    railway status
}

# Function to show environment variables
env() {
    echo "🔑 Environment variables:"
    railway variables
}

# Function to add PostgreSQL service
add_postgres() {
    echo "🗄️ Adding PostgreSQL service..."
    echo "Please add a PostgreSQL service manually in the Railway dashboard:"
    echo "1. Go to your project in Railway"
    echo "2. Click 'New Service'"
    echo "3. Choose 'Database' → 'PostgreSQL'"
    echo "4. Railway will automatically connect it to your app"
    echo "5. The DATABASE_URL will be automatically added to your environment variables"
}

# Function to show help
show_help() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  deploy      - Build and deploy the app"
    echo "  logs        - View deployment logs"
    echo "  dashboard   - Open Railway dashboard"
    echo "  status      - Check deployment status"
    echo "  env         - Show environment variables"
    echo "  postgres    - Instructions for adding PostgreSQL"
    echo "  help        - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy"
    echo "  $0 logs"
    echo "  $0 status"
}

# Main script logic
case "${1:-help}" in
    "deploy")
        deploy
        ;;
    "logs")
        logs
        ;;
    "dashboard")
        dashboard
        ;;
    "status")
        status
        ;;
    "env")
        env
        ;;
    "postgres")
        add_postgres
        ;;
    "help"|*)
        show_help
        ;;
esac
