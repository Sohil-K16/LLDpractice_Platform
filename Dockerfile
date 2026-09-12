# Multi-stage build for LLD Practice Platform
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
COPY server/prisma ./server/prisma

RUN npm run install:all

COPY client/ ./client/
COPY server/ ./server/

RUN npm run build
RUN npm run db:setup

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL="file:./dev.db"

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/package*.json ./server/
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/prisma ./server/prisma

EXPOSE 5000

CMD ["npm", "start"]
