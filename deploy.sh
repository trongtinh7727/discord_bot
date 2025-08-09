#!/bin/bash
set -e

APP_DIR="/home/ubuntu/discord/discord_bot"
BRANCH="main"
SERVICE_NAME="tts-bot"

echo "=================================="
echo "Discord TTS Bot - Auto Deploy"
echo "=================================="

# Kiểm tra thư mục app
if [ ! -d "$APP_DIR" ]; then
    echo "[ERROR] App directory not found: $APP_DIR"
    exit 1
fi

cd "$APP_DIR"

echo "[*] Current directory: $(pwd)"

echo "[*] Fixing Git ownership and permissions..."
git config --global --add safe.directory "$APP_DIR" 2>/dev/null || true
sudo chown -R ubuntu:ubuntu "$APP_DIR" 2>/dev/null || true

echo "[*] Git status before pull:"
git status --short

echo "[*] Fetching latest changes..."
git fetch --all

echo "[*] Resetting to latest $BRANCH..."
git reset --hard "origin/$BRANCH"

echo "[*] Pulling latest code..."
git pull origin "$BRANCH"

echo "[*] Installing/updating dependencies..."
npm install --production

echo "[*] Detecting deployment method..."

# Ưu tiên Docker Compose
if [ -f "docker-compose.yml" ]; then
    echo "[*] Found docker-compose.yml - Using Docker deployment"
    
    # Dừng container cũ (nếu có)
    docker compose down 2>/dev/null || true
    
    # Build và chạy container mới
    docker compose up -d --build
    
    # Cleanup images cũ
    docker image prune -f 2>/dev/null || true
    
    echo "[*] Checking container status..."
    docker compose ps
    
# Fallback: PM2
elif command -v pm2 >/dev/null 2>&1; then
    echo "[*] Using PM2 deployment"
    
    # Restart hoặc start service
    pm2 restart "$SERVICE_NAME" 2>/dev/null || pm2 start app.js --name "$SERVICE_NAME"
    pm2 save
    
    echo "[*] PM2 status:"
    pm2 status "$SERVICE_NAME"
    
# Fallback: Node trực tiếp
else
    echo "[*] Using direct Node.js deployment"
    
    # Kill process cũ (nếu có)
    pkill -f "node app.js" 2>/dev/null || true
    sleep 2
    
    # Start process mới
    nohup node app.js > bot.log 2>&1 &
    sleep 3
    
    # Kiểm tra process
    if pgrep -f "node app.js" > /dev/null; then
        echo "[✓] Bot started successfully"
        echo "[*] Process ID: $(pgrep -f 'node app.js')"
    else
        echo "[ERROR] Failed to start bot"
        exit 1
    fi
fi

echo "=================================="
echo "[✓] Deployment completed!"
echo "=================================="

# Show logs (optional)
if [ "$1" = "--logs" ]; then
    echo "[*] Showing recent logs..."
    if [ -f "docker-compose.yml" ]; then
        docker compose logs --tail=20
    elif command -v pm2 >/dev/null 2>&1; then
        pm2 logs "$SERVICE_NAME" --lines 20
    else
        tail -20 bot.log 2>/dev/null || echo "No logs found"
    fi
fi
