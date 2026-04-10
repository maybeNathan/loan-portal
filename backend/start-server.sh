#!/bin/bash
# Quick local dev server without Docker

# Check if MongoDB is running locally
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running!"
    echo ""
    echo "Please install and start MongoDB:"
    echo "1. Install MongoDB Community Edition"
    echo "2. Run: mongod --dbpath=/data/db"
    echo ""
    echo "Alternatively, use MongoDB Atlas (free cloud):"
    echo "- Sign up: https://www.mongodb.com/cloud/atlas"
    echo "- Create free cluster"
    echo "- Update backend/.env with your connection string"
    echo ""
    exit 1
fi

echo "✅ MongoDB is running"
echo "🚀 Starting backend server on http://localhost:5000"
echo ""

node server.js
