FROM node:18-alpine

WORKDIR /app

# Install PM2
RUN npm install -g pm2

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Start with PM2
CMD ["pm2-runtime", "server.js", "--no-daemon"]
