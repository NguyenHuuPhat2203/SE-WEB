# Docker Deployment Guide

## 📋 Prerequisites

- Docker Desktop installed (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+
- At least 2GB free disk space

## 🏗️ Project Structure

```
SE-WEB/
├── docker-compose.yml          # Orchestration file
├── Dockerfile.frontend         # Frontend React build
├── nginx.conf                  # Nginx configuration
├── .dockerignore              # Files to exclude
└── server/
    ├── Dockerfile             # Backend Express build
    ├── .dockerignore         # Server files to exclude
    └── scripts/
        └── mongo-init.js     # MongoDB initialization
```

## 🚀 Quick Start

### 1. Build and Start All Services

```bash
# Build images and start containers
docker-compose up --build -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### 2. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **MongoDB**: localhost:27017

### 3. Initialize Database with Demo Data

```bash
# Enter backend container
docker exec -it se-web-backend sh

# Run seed script
node scripts/seed.js

# Exit container
exit
```

### 4. Stop Services

```bash
# Stop all containers
docker-compose down

# Stop and remove volumes (⚠️ deletes database)
docker-compose down -v
```

## 🔧 Development Commands

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f mongodb
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild After Code Changes

```bash
# Rebuild specific service
docker-compose up --build frontend -d
docker-compose up --build backend -d

# Rebuild all
docker-compose up --build -d
```

### Execute Commands in Containers

```bash
# Backend shell
docker exec -it se-web-backend sh

# MongoDB shell
docker exec -it se-web-mongodb mongosh -u admin -p admin123

# Frontend shell (nginx)
docker exec -it se-web-frontend sh
```

## 🗄️ MongoDB Management

### Access MongoDB Shell

```bash
docker exec -it se-web-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

### MongoDB Commands

```javascript
// Switch to database
use se-web-tutoring

// View collections
show collections

// Count documents
db.users.countDocuments()

// Find users
db.users.find().pretty()

// Create backup
db.users.find().forEach(printjson)
```

### Backup Database

```bash
# Create backup
docker exec se-web-mongodb mongodump \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  -d se-web-tutoring \
  -o /data/backup

# Copy backup to host
docker cp se-web-mongodb:/data/backup ./backup
```

### Restore Database

```bash
# Copy backup to container
docker cp ./backup se-web-mongodb:/data/backup

# Restore
docker exec se-web-mongodb mongorestore \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  -d se-web-tutoring \
  /data/backup/se-web-tutoring
```

## 🔐 Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/se-web-tutoring?authSource=admin
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
```

### Production Deployment

⚠️ **Important**: Change these values in production!

1. Generate strong JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. Update docker-compose.yml:

```yaml
environment:
  JWT_SECRET: <generated-secret>
  MONGO_INITDB_ROOT_PASSWORD: <strong-password>
```

## 📊 Monitoring

### Check Container Health

```bash
docker-compose ps
docker inspect se-web-backend --format='{{.State.Health.Status}}'
```

### Resource Usage

```bash
docker stats
```

### Disk Space

```bash
# Show disk usage
docker system df

# Clean up unused resources
docker system prune -a --volumes
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Check what's using port
netstat -ano | findstr :80
netstat -ano | findstr :3001

# Kill process or change ports in docker-compose.yml
```

### Container Won't Start

```bash
# View detailed logs
docker-compose logs backend

# Check container events
docker events

# Inspect container
docker inspect se-web-backend
```

### MongoDB Connection Issues

```bash
# Test connection from backend
docker exec -it se-web-backend sh
nc -zv mongodb 27017

# Check MongoDB logs
docker-compose logs mongodb
```

### Frontend Not Loading

```bash
# Check nginx config
docker exec se-web-frontend cat /etc/nginx/conf.d/default.conf

# Test nginx config
docker exec se-web-frontend nginx -t

# Reload nginx
docker exec se-web-frontend nginx -s reload
```

## 🔄 CI/CD Integration

### Build Images

```bash
# Tag for registry
docker tag se-web-frontend:latest your-registry/se-web-frontend:v1.0.0
docker tag se-web-backend:latest your-registry/se-web-backend:v1.0.0

# Push to registry
docker push your-registry/se-web-frontend:v1.0.0
docker push your-registry/se-web-backend:v1.0.0
```

### Production Deployment

```bash
# Pull latest images
docker-compose pull

# Update services with zero downtime
docker-compose up -d --no-deps --build frontend
docker-compose up -d --no-deps --build backend
```

## 📝 Notes

- **Data Persistence**: MongoDB data is stored in Docker volumes
- **Hot Reload**: Not enabled in production builds (use development mode locally)
- **Security**: Default passwords are for development only
- **Scaling**: Use `docker-compose up --scale backend=3` to scale services
- **Networks**: All containers communicate via `se-web-network`

## 🆘 Support

For issues:

1. Check logs: `docker-compose logs -f`
2. Verify all services: `docker-compose ps`
3. Test connectivity: `docker exec -it se-web-backend ping mongodb`
4. Rebuild from scratch: `docker-compose down -v && docker-compose up --build -d`
