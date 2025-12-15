# syntax=docker/dockerfile:1

FROM node:20-slim AS base
WORKDIR /app

# Build stage
FROM base AS builder
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build

# Runtime stage
FROM base AS production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main"]
