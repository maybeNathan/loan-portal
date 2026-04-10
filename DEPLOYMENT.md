# Fix & Flip Loan Portal - Deployment Guide for Hostinger VPS

## Quick Start Options

### Option A: Docker Deployment (Recommended)
Simplest method - automated containerized deployment

### Option B: Manual Deployment Script
Full control over server configuration

---

## Prerequisites

- **Hostinger VPS** (KVM 3+ recommended - 2GB RAM minimum)
- Root SSH access to your VPS
- Domain name pointing to your VPS
- Basic Linux command knowledge

---

## Option A: Docker Deployment (Easiest)

### Step 1: Install Docker & Docker Compose

SSH into your Hostinger VPS:
```bash
ssh root@your-vps-ip
```

Install Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker
```

Install Docker Compose:
```bash
mkdir -p /usr/local/bin
curl -L https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

### Step 2: Upload Your Code

**Via Git:**
```bash
cd /opt
git clone https://your-repo.git fix-flip-portal
cd fix-flip-portal
```

**Via SFTP** (Hostinger File Manager or FileZilla):
Upload entire project folder to `/opt/fix-flip-portal`

### Step 3: Configure Environment

Create `.env` file in root:
```bash
cd /opt/fix-flip-portal
cat > .env <<EOF
MONGO_ROOT_PASSWORD=change-this-to-secure-password
EOF
```

### Step 4: Start the Application

```bash
# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && npm run build && cd ..

# Start with Docker Compose
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 5: Setup Nginx as Reverse Proxy

Install Nginx:
```bash
apt update
apt install nginx -y
```

Create Nginx config:
```bash
nano /etc/nginx/sites-available/fix-flip-portal
```

Add this content (**replace DOMAIN with your domain**):
```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# API
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/fix-flip-portal /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
```

### Step 6: Setup SSL with Certbot

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

---

## Option B: Manual Deployment Script

### Run the Automated Script

```bash
# Upload deploy.sh to your VPS
cd /opt
chmod +x deploy.sh
sudo ./deploy.sh
```

The script will:
1. Update system packages
2. Install Node.js 18, PM2, Nginx, MongoDB
3. Clone your repository
4. Install dependencies & build frontend
5. Configure Nginx with proper routing
6. Set up MongoDB authentication
7. Start backend with PM2
8. Configure firewall
9. Install SSL certificates

### Manual Steps (If script fails)

#### 1. Install Node.js 18
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs
```

#### 2. Install MongoDB 6.0
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
```

#### 3. Setup MongoDB Authentication
```bash
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "your-secure-password",
  roles: ["root"]
});
exit
```

Edit `/etc/mongodb.conf`:
```conf
security:
  authorization: enabled
```

Restart: `systemctl restart mongod`

#### 4. Configure Environment Variables

**Root `.env`:**
```env
API_URL=https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

**Backend `backend/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://admin:password@localhost:27017/fix-flip-portal?authSource=admin
JWT_SECRET=generate-secure-random-string-here
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://yourdomain.com
NODE_ENV=production
```

**Frontend `frontend/.env`:**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

#### 5. Install & Build
```bash
cd /opt/fix-flip-portal
npm install

cd frontend
npm install
npm run build

cd ../backend
npm install
```

#### 6. Setup PM2
```bash
npm install -g pm2

cd /opt/fix-flip-portal/backend
pm2 start server.js --name fix-flip-api
pm2 startup
pm2 save
```

#### 7. Configure Nginx (see Option A Step 5)

---

## Domain Configuration

### DNS Records (in Hostinger Control Panel)

| Type | Name | Value |
|------|------|-------|
| A | yourdomain.com | YOUR_VPS_IP |
| A | api.yourdomain.com | YOUR_VPS_IP |

Wait 30 mins - 24 hours for DNS propagation.

---

## Environment Files Checklist

Before deploying, ensure these files exist:

```
fix-flip-portal/
├── .env                    # MONGO_ROOT_PASSWORD=...
├── backend/
│   ├── .env               # MongoDB URI, JWT secrets
│   └── Dockerfile
└── frontend/
    ├── .env               # VITE_API_URL
    └── Dockerfile
```

---

## Security Checklist

### MUST DO After Deployment:

- [x] Change `JWT_SECRET` to random secure string
  ```bash
  openssl rand -base64 32
  ```
- [x] Change MongoDB root password
- [x] Update firewall rules (ufw or iptables)
- [x] Install fail2ban (optional)
  ```bash
  apt install fail2ban -y
  ```
- [x] Keep system updated
  ```bash
  apt update && apt upgrade -y
  ```

### SSL Certificate
Auto-renews every 90 days. Test renewal:
```bash
certbot renew --dry-run
```

---

## Backup Strategy

### MongoDB Backup
```bash
# Create backup
mongodump --uri="mongodb://admin:password@localhost:27017/admin?authSource=admin" --out=/backups/db-$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://admin:password@localhost:27017/admin?authSource=admin" /backups/db-20240101
```

### App Backup
```bash
tar -czf /backups/fix-flip-$(date +%Y%m%d).tar.gz /opt/fix-flip-portal
```

### Schedule Backups (cron)
```bash
crontab -e
# Add nightly backup at 2am
0 2 * * * /root/backup-script.sh >> /var/log/backup.log 2>&1
```

---

## Troubleshooting

### Check Application Status

```bash
# PM2 processes
pm2 list
pm2 logs fix-flip-api

# Docker containers
docker-compose ps
docker-compose logs -f api
docker-compose logs -f frontend

# MongoDB
systemctl status mongod

# Nginx
systemctl status nginx
nginx -t  # Test config
```

### Common Issues

**Port already in use:**
```bash
sudo lsof -i :5000
sudo kill -9 PID
```

**MongoDB connection refused:**
```bash
# Check if running
systemctl status mongod

# Check authentication
cat /etc/mongodb.conf
```

**SSL not working:**
```bash
certbot certificates
certbot renew
```

**CORS errors:**
Update `backend/.env`:
```env
FRONTEND_URL=https://yourdomain.com
```

**API not responding:**
```bash
curl http://localhost:5000/api/health
```

---

## Post-Deployment Checklist

- [ ] Test frontend URL: https://yourdomain.com
- [ ] Test API endpoint: https://api.yourdomain.com/api/health
- [ ] Register test user
- [ ] Create test loan application
- [ ] Upload test document
- [ ] Send test message
- [ ] Test all calculators
- [ ] Verify SSL certificate (https://yourdomain.com)
- [ ] Set up monitoring (optional: UptimeRobot)
- [ ] Document admin credentials securely
- [ ] Configure email service (nodemailer)
- [ ] Set up automated backups

---

## Maintenance Commands

```bash
# Update application code
cd /opt/fix-flip-portal
git pull

# Rebuild frontend
cd frontend
npm run build

# Restart backend
pm2 restart fix-flip-api

# Docker: rebuild and restart
cd /opt/fix-flip-portal
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# View PM2 process manager UI
pm2 install pm2-web
pm2 web
```

---

## Performance Monitoring

### Install htop
```bash
apt install -y htop
htop
```

### Check resource usage
```bash
# CPU & Memory
uptime
free -h

# Disk space
df -h

# Network
netstat -tuln
```

### MongoDB stats
```bash
mongosh
use fix-flip-portal
db.stats()
```

---

## Support & Resources

- **Hostinger VPS Docs:** https://www.hostinger.com/tutorials
- **PM2 Docs:** https://pm2.io/docs/
- **Docker Docs:** https://docs.docker.com/
- **MongoDB Docs:** https://www.mongodb.com/docs/
- **Nginx Docs:** https://nginx.org/en/docs/

---

## Costs Estimate (Hostinger)

| Option | Monthly Cost |
|--------|-------------|
| KVM VPS 3 | €3.99/mo (2GB RAM, 20GB SSD) |
| KVM VPS 4 | €5.99/mo (4GB RAM, 40GB SSD) |
| Domain | €1.99-year (first year) |
| SSL | Free (Let's Encrypt) |

**Recommendation:** KVM VPS 4 for production use

---

## Need Help?

For issues:
1. Check PM2 logs: `pm2 logs fix-flip-api`
2. Check Docker logs: `docker-compose logs -f`
3. Check Nginx logs: `/var/log/nginx/error.log`
4. Check MongoDB logs: `journalctl -u mongod`

---

*Created: April 2026*
*Version: 1.0*
