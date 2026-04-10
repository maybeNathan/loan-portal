#!/bin/bash

#####################################
# Fix & Flip Portal Deployment Script
# For Hostinger VPS (Ubuntu/Debian)
#####################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Fix & Flip Portal Deployment Script${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (sudo)${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Updating system...${NC}"
apt update -y
apt upgrade -y
apt install -y curl wget git net-tools telnet htop

echo -e "${GREEN}✓ System updated${NC}"
echo ""

echo -e "${YELLOW}Step 2: Installing Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
npm install -g npm@latest
echo -e "${GREEN}✓ Node.js installed: $(node --version)${NC}"
echo ""

echo -e "${YELLOW}Step 3: Installing PM2 (process manager)...${NC}"
npm install -g pm2
echo -e "${GREEN}✓ PM2 installed${NC}"
echo ""

echo -e "${YELLOW}Step 4: Installing MongoDB 6.0...${NC}"
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod
echo -e "${GREEN}✓ MongoDB started${NC}"
echo ""

echo -e "${YELLOW}Step 5: Installing Nginx...${NC}"
apt install -y nginx
systemctl start nginx
systemctl enable nginx
echo -e "${GREEN}✓ Nginx installed${NC}"
echo ""

echo -e "${YELLOW}Step 6: Setting up firewall...${NC}"
apt install -y ufw
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 22/tcp
ufw --force enable
echo -e "${GREEN}✓ Firewall configured${NC}"
echo ""

echo -e "${YELLOW}Step 7: Creating application directory...${NC}"
mkdir -p /var/www/fix-flip-portal
echo -e "${GREEN}✓ Directory created${NC}"
echo ""

echo -e "${YELLOW}Step 8: Cloning your repository...${NC}"
read -p "Enter your Git repository URL: " REPO_URL
if [ -z "$REPO_URL" ]; then
    echo -e "${RED}Repository URL cannot be empty${NC}"
    exit 1
fi
cd /var/www/fix-flip-portal
git clone $REPO_URL . || true
echo -e "${GREEN}✓ Repository cloned${NC}"
echo ""

echo -e "${YELLOW}Step 9: Installing dependencies...${NC}"
npm install
cd frontend
npm install
npm run build
cd ../backend
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

echo -e "${YELLOW}Step 10: Setting up environment variables...${NC}"
cd /var/www/fix-flip-portal/backend

read -p "Enter JWT_SECRET (or press Enter to generate): " JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
fi

cat > .env <<EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fix-flip-portal
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://$(hostname -I | awk '{print $1}')
NODE_ENV=production
EOF

echo -e "${GREEN}✓ Environment configured${NC}"
echo ""

echo -e "${YELLOW}Step 11: Configuring Nginx...${NC}"
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN
read -p "Enter your server IP address: " SERVER_IP

# Frontend Nginx config
cat > /etc/nginx/sites-available/fix-flip-frontend <<EOF
server {
    listen 80;
    server_name ${DOMAIN};
    
    root /var/www/fix-flip-portal/frontend/dist;
    index index.html;

    try_files \$uri /index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# API Nginx config
cat > /etc/nginx/sites-available/fix-flip-api <<EOF
server {
    listen 80;
    server_name api.${DOMAIN};

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_buffering off;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Enable sites
ln -sf /etc/nginx/sites-available/fix-flip-frontend /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/fix-flip-api /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
nginx -t

# Restart Nginx
systemctl restart nginx

echo -e "${GREEN}✓ Nginx configured${NC}"
echo ""

echo -e "${YELLOW}Step 12: Starting backend with PM2...${NC}"
cd /var/www/fix-flip-portal/backend
pm2 start server.js --name fix-flip-api
pm2 startup
pm2 save
echo -e "${GREEN}✓ PM2 started and configured${NC}"
echo ""

echo -e "${YELLOW}Step 13: Setting up MongoDB authentication...${NC}"
mongosh <<EOF
use admin
db.createUser({
  user: "admin",
  pwd: process.env.MONGO_PASSWORD || "admin123",
  roles: [
    { role: "root", db: "admin" },
    { role: "readWrite", db: "fix-flip-portal" }
  ]
});
EOF

echo -e "${GREEN}✓ MongoDB user created${NC}"
echo ""

echo -e "${YELLOW}Step 14: Enabling MongoDB authentication...${NC}"
sed -i 's/#security:/security:/' /etc/mongodb.conf
sed -i '/security:/a authorization: enabled' /etc/mongodb.conf
systemctl restart mongod

echo -e "${GREEN}✓ MongoDB auth enabled${NC}"
echo ""

echo -e "${YELLOW}Step 15: Setting up HTTPS with Let's Encrypt...${NC}"
apt install -y certbot python3-certbot-nginx

if [ "$DOMAIN" != "yourdomain.com" ]; then
    certbot --nginx -d $DOMAIN -d api.$DOMAIN --non-interactive --agree-tos --email $(whoami@unknown)
fi

echo -e "${GREEN}✓ Certificate setup complete${NC}"
echo ""

echo -e "${YELLOW}Step 16: Final configuration...${NC}"
chmod -R 755 /var/www/fix-flip-portal/backend/uploads

echo -e "${GREEN}✓ Permissions set${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  DEPLOYMENT COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your application should now be accessible at:"
echo "  Frontend: http://$DOMAIN"
echo "  API:      http://api.$DOMAIN"
echo ""
echo "Important PM2 commands:"
echo "  pm2 list              # List all processes"
echo "  pm2 logs fix-flip-api # View backend logs"
echo "  pm2 status            # Check status"
echo "  pm2 restart fix-flip-api # Restart backend"
echo ""
echo "MongoDB shell:"
echo "  mongosh -u admin -p admin123"
echo ""
echo -e "${YELLOW}DON'T FORGET:${NC}"
echo "1. Update DNS A records for $DOMAIN and api.$DOMAIN pointing to: $SERVER_IP"
echo "2. Change MongoDB password in production"
echo "3. Set up regular backups"
echo "4. Configure email service if needed"
echo ""
echo "For Docker deployment, use: docker-compose up -d"
