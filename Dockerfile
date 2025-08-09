FROM node:20-bullseye

# Cài ffmpeg cho xử lý âm thanh
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
# Cài dependencies (giữ dev nếu bạn chưa build gì)
RUN npm install

# Copy source
COPY . .

ENV NODE_ENV=production
# Nếu muốn: RUN npm prune --production

CMD ["node", "app.js"]