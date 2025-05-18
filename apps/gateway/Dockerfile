# BASE
FROM node:18-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci

# DEV
FROM base as dev

COPY . .

CMD ["npm", "run", "start:dev", "gateway"]

# BUILDER
FROM base AS builder

COPY . .
RUN npm run build gateway

ENV NODE_ENV production
RUN npm ci --omit=dev && npm cache clean --force

# RUNNER
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

USER node

CMD ["node", "dist/apps/gateway/main"]
