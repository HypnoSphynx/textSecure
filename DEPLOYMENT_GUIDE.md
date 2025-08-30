# TextChat Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying the TextChat application to various environments, from local development to production. The application consists of:

- **Backend**: Node.js/Express API server
- **Frontend**: React application built with Vite
- **Database**: MongoDB (local or cloud)

## 📋 Prerequisites

Before deployment, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **MongoDB** (local installation or cloud service)
- **Domain name** (for production)
- **SSL certificate** (for production HTTPS)

## 🏠 Local Development Deployment

### Quick Start

1. **Clone the repository**:
```bash
git clone <repository-url>
cd crypto_test
```

2. **Backend setup**:
```bash
cd backend
npm install
cp .env.example .env  # Create environment file
# Edit .env with your configuration
npm run dev
```

3. **Frontend setup**:
```bash
cd ../frontend
npm install
npm run dev
```

4. **Access the application**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Environment Configuration

#### Backend (.env)
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/textchat_app

# Security Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ENCRYPTION_KEY=your-secret-key-32-chars-long!!

# Optional: Logging
LOG_LEVEL=debug
```

#### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Optional: Feature flags
VITE_ENABLE_ANALYTICS=false
VITE_DEBUG_MODE=true
```

## 🐳 Docker Deployment

### Docker Compose Setup

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'

services:
  # MongoDB Service
  mongodb:
    image: mongo:6.0
    container_name: textchat-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: textchat_app
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - textchat-network

  # Backend Service
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: textchat-backend
    restart: unless-stopped
    environment:
      PORT: 3000
      NODE_ENV: production
      MONGO_URI: mongodb://admin:password123@mongodb:27017/textchat_app?authSource=admin
      JWT_SECRET: your-super-secret-jwt-key-change-in-production
      ENCRYPTION_KEY: your-secret-key-32-chars-long!!
    ports:
      - "3000:3000"
    depends_on:
      - mongodb
    networks:
      - textchat-network

  # Frontend Service
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: textchat-frontend
    restart: unless-stopped
    environment:
      VITE_API_URL: http://localhost:3000/api
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - textchat-network

  # Nginx Reverse Proxy (Optional)
  nginx:
    image: nginx:alpine
    container_name: textchat-nginx
    restart: unless-stopped
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    networks:
      - textchat-network

volumes:
  mongodb_data:

networks:
  textchat-network:
    driver: bridge
```

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/ || exit 1

# Start application
CMD ["npm", "start"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;

    # Frontend
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Deployment Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Remove all containers and volumes
docker-compose down -v
```

## ☁️ Cloud Deployment

### Heroku Deployment

#### Backend Deployment

1. **Create Heroku app**:
```bash
heroku create textchat-backend
```

2. **Set environment variables**:
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/textchat_app
heroku config:set JWT_SECRET=your-super-secret-jwt-key-change-in-production
heroku config:set ENCRYPTION_KEY=your-secret-key-32-chars-long!!
```

3. **Deploy backend**:
```bash
cd backend
git init
git add .
git commit -m "Initial backend deployment"
heroku git:remote -a textchat-backend
git push heroku main
```

#### Frontend Deployment

1. **Create Heroku app**:
```bash
heroku create textchat-frontend
```

2. **Set environment variables**:
```bash
heroku config:set VITE_API_URL=https://textchat-backend.herokuapp.com/api
```

3. **Deploy frontend**:
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend deployment"
heroku git:remote -a textchat-frontend
git push heroku main
```

### AWS Deployment

#### EC2 Instance Setup

1. **Launch EC2 instance**:
```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2
sudo npm install -g pm2
```

2. **Deploy application**:
```bash
# Clone repository
git clone <repository-url>
cd crypto_test

# Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env with production values
pm2 start src/server.js --name "textchat-backend"

# Setup frontend
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/html/
```

3. **Configure Nginx**:
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/textchat
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/textchat /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### DigitalOcean App Platform

1. **Create app from GitHub repository**
2. **Configure environment variables**:
   - `NODE_ENV=production`
   - `MONGO_URI=mongodb+srv://...`
   - `JWT_SECRET=...`
   - `ENCRYPTION_KEY=...`

3. **Set build commands**:
   - Backend: `npm start`
   - Frontend: `npm run build`

## 🔒 Production Security Checklist

### Environment Security
- [ ] Use strong, unique JWT secrets
- [ ] Use 32-character encryption keys
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for specific domains
- [ ] Use environment-specific MongoDB URIs
- [ ] Implement rate limiting
- [ ] Enable security headers

### Database Security
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Enable authentication and authorization
- [ ] Configure network access controls
- [ ] Enable encryption at rest
- [ ] Regular backup schedule
- [ ] Monitor database access

### Application Security
- [ ] Keep dependencies updated
- [ ] Implement input validation
- [ ] Use HTTPS for all communications
- [ ] Configure proper error handling
- [ ] Enable logging and monitoring
- [ ] Implement health checks

### Infrastructure Security
- [ ] Use secure cloud provider
- [ ] Configure firewall rules
- [ ] Enable monitoring and alerting
- [ ] Regular security updates
- [ ] Access control and IAM
- [ ] Backup and disaster recovery

## 📊 Monitoring and Logging

### Application Monitoring

#### Health Check Endpoint
```javascript
// Add to backend/src/server.js
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version
  });
});
```

#### PM2 Monitoring
```bash
# Monitor application
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart textchat-backend
```

#### Logging Configuration
```javascript
// Add structured logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: |
          cd backend && npm install
          cd ../frontend && npm install
      
      - name: Run tests
        run: |
          cd backend && npm test
          cd ../frontend && npm test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.14
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "textchat-backend"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.14
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "textchat-frontend"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

## 🚨 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check if port is in use
lsof -i :3000

# Check environment variables
echo $NODE_ENV
echo $MONGO_URI

# Check logs
pm2 logs textchat-backend
```

#### Frontend Build Issues
```bash
# Clear cache
npm run build -- --force

# Check dependencies
npm audit fix

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### Database Connection Issues
```bash
# Test MongoDB connection
mongo "mongodb://localhost:27017/textchat_app"

# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

#### SSL/HTTPS Issues
```bash
# Check SSL certificate
openssl s_client -connect your-domain.com:443

# Test nginx configuration
sudo nginx -t

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 📈 Performance Optimization

### Backend Optimization
- Enable compression middleware
- Implement caching (Redis)
- Use database indexing
- Optimize database queries
- Enable clustering with PM2

### Frontend Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading
- Optimize bundle size
- Enable service workers

### Database Optimization
- Create proper indexes
- Use connection pooling
- Monitor query performance
- Implement read replicas
- Regular maintenance

---

This deployment guide provides comprehensive instructions for deploying TextChat to various environments. For additional support, refer to the main documentation or create an issue in the repository.
