# syntax=docker/dockerfile:1

# Stage 1: Install dependencies
FROM node:20.20.2-alpine3.23 AS deps
WORKDIR /app
RUN apk --no-cache upgrade && npm install -g npm@10

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Build application
FROM node:20.20.2-alpine3.23 AS builder
WORKDIR /app
RUN apk --no-cache upgrade && npm install -g npm@10

ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Stage 3: Production runner
FROM node:20.20.2-alpine3.23 AS runner
WORKDIR /app
RUN apk --no-cache upgrade && npm install -g npm@10

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
