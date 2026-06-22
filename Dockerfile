# Step 1: Build Phase
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Production Execution Phase
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Vite మరియు Esbuild బిల్డ్ చేసిన ప్రొడక్షన్ ఫైల్స్ కాపీ చేయడం
COPY --from=builder /app/dist ./dist

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

# Esbuild కంపైల్ చేసిన సర్వర్‌ను డైరెక్ట్‌గా రన్ చేయడం (అత్యంత వేగంగా రన్ అవుతుంది)
CMD ["node", "dist/server.cjs"]
