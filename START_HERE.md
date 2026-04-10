# 🚀 Local Development Setup

## Prerequisites

- ✅ Node.js 18+ (installed: v18.19.1)
- ✅ npm 9+ (installed: v9.2.0)
- ⚠️ MongoDB (needs to be installed & running)
- Dependencies installed

## Quick Start

### Step 1: Start MongoDB

**Option A - If you have MongoDB installed:**
```bash
# Start MongoDB
mongod --dbpath=/data/db

# Or using service (Ubuntu/Debian)
sudo systemctl start mongod
```

**Option B - Install MongoDB:**

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Mac (Homebrew):**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download from: https://www.mongodb.com/try/download/community

### Step 2: Verify MongoDB is Running

```bash
mongosh --eval "db.version()"
# Should output: "6.0.x"
```

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
cd fix-flip-portal/backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd fix-flip-portal/frontend
npm run dev
```

### Step 4: Open in Browser

- Frontend: http://localhost:3000
- API: http://localhost:5000/api

---

## Alternative: Use MongoDB Atlas (Free Cloud DB)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster (M0)
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (for dev only)
5. Get connection string
6. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fix-flip-portal
   ```
7. Run: `cd backend && node server.js`

---

## Troubleshooting

**MongoDB connection error:**
```bash
# Check if MongoDB is running
pgrep -x "mongod"
# or
systemctl status mongod
```

**Port 27017 in use:**
```bash
# Find what's using the port
sudo lsof -i :27017

# Kill the process
sudo kill -9 PID
```

**Dependencies issue:**
```bash
cd backend && npm install
cd ../frontend && npm install
```

---

## Deploy to Hostinger?

See **DEPLOYMENT.md** for complete Hostinger VPS setup instructions.
