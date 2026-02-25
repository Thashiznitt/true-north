# Backend Deployment Guide (Optimized)

This document outlines the setup and deployment of the True North backend, designed for cost-efficiency and performance on a single VPS (Hetzner CX31 or equivalent).

## Architecture Overview

True North uses a containerized architecture to keep infra costs low while supporting heavy traffic.

- **Node.js (Express)**: Handles API requests from mobile clients.
- **Redis**: Caches AI reflections to minimize token usage and latency.
- **Prisma**: ORM for PostgreSQL (Supabase).
- **Docker Compose**: Orchestrates the services.
- **PM2**: Ensures Node process stability and logging.

## Server Requirements

- **Provider**: Hetzner Cloud (Recommended: CX31 or CX21)
- **OS**: Ubuntu 24.04 LTS
- **SSH Key**: Configured for root access

## Step-by-Step Setup

### 1. Provision the VPS
Create a server via Hetzner Cloud CLI or Web Panel:
```bash
hcloud server create --name truenorth-vps --type cx31 --image ubuntu-24.04 --ssh-key <YOUR_SSH_KEY>
```

### 2. Install Dependencies
Run these commands on your VPS:
```bash
apt update && apt upgrade -y
apt install -y git docker.io docker-compose build-essential
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable
```

### 3. Deploy the Stack
Clone the repository and start the containers:
```bash
cd /opt
git clone https://github.com/Thashiznitt/true-north.git
cd true-north

# Ensure your .env file is populated with:
# DATABASE_URL, DIRECT_URL, GEMINI_API_KEY

docker-compose up -d --build
```

### 4. Setup Daily AI Caching (Cron)
To keep costs low, we pre-cache reflections nightly. Add this to your crontab (`crontab -e`):
```cron
0 2 * * * cd /opt/true-north && docker-compose exec node-app node scripts/cacheGhostCircles.js >> /var/log/ghostcache.log 2>&1
```

## Monitoring & Logs

### View Container Status
```bash
docker-compose ps
```

### View Application Logs (PM2)
```bash
docker-compose exec node-app pm2 status
docker-compose exec node-app pm2 logs
```

### Redis Health
```bash
docker-compose exec redis redis-cli -a truenorth_redis_pwd ping
```

---

## Future Scaling
When traffic exceeds 10K daily active users:
1. Add a second VPS.
2. Setup an Nginx/HAProxy load balancer.
3. Move Redis to a dedicated node or a cluster.
