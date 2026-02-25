#!/bin/bash

# --- True North Automated Hetzner Deployment ---
# This script provisions a VPS and deploys the Dockerized backend.

# 1. Configuration
SERVER_NAME="truenorth-vps"
SERVER_TYPE="cx31"
IMAGE="ubuntu-24.04"
SSH_KEY_NAME="<YOUR_SSH_KEY_NAME>" # Replace with your Hetzner SSH key name
REPO_URL="https://github.com/Thashiznitt/true-north.git"

# 2. Provision VPS
echo "🚀 Provisioning VPS: $SERVER_NAME ($SERVER_TYPE)..."
hcloud server create --name "$SERVER_NAME" --type "$SERVER_TYPE" --image "$IMAGE" --ssh-key "$SSH_KEY_NAME"

# Wait for IP to be assigned
echo "⏳ Waiting for IP assignment..."
sleep 15
IP=$(hcloud server describe "$SERVER_NAME" -o json | jq -r '.public_net.ipv4.ip')

echo "✅ Server created at IP: $IP"

# 3. Remote Setup (Install Docker & Node)
echo "📦 Installing dependencies on remote server..."
ssh -o StrictHostKeyChecking=no root@"$IP" << 'EOF'
apt update && apt upgrade -y
apt install -y git docker.io docker-compose build-essential
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt install -y nodejs
npm install -g pm2
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw --force enable
EOF

# 4. Deploy Application
echo "🏗️ Cloning repository and starting stack..."
ssh root@"$IP" << EOF
mkdir -p /opt/true-north
git clone $REPO_URL /opt/true-north
cd /opt/true-north

# Note: You MUST manually edit .env here or scp it from local
echo "⚠️  Reminder: Create /opt/true-north/.env with your DATABASE_URL, DIRECT_URL, and GEMINI_API_KEY"

docker-compose up -d --build
EOF

# 5. Setup Cron
echo "⏰ Setting up daily caching cron job..."
ssh root@"$IP" << 'EOF'
cat > /etc/cron.d/ai-cache <<EOL
0 2 * * * root cd /opt/true-north && docker-compose exec node-app node scripts/cacheGhostCircles.js >> /var/log/ghostcache.log 2>&1
EOL
chmod 644 /etc/cron.d/ai-cache
EOF

echo "🏁 Deployment sequence complete!"
echo "📡 Health check: curl http://$IP:3000/health"
