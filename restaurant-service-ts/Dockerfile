# Multi-stage build for Restaurant Service
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files for all dependencies
COPY common/common-domain/package*.json ./common/common-domain/
COPY common/common-application/package*.json ./common/common-application/
COPY common/common-dataaccess/package*.json ./common/common-dataaccess/
COPY infrastructure/kafka-producer/package*.json ./infrastructure/kafka-producer/
COPY infrastructure/kafka-consumer/package*.json ./infrastructure/kafka-consumer/
COPY infrastructure/kafka-model/package*.json ./infrastructure/kafka-model/
COPY infrastructure/outbox/package*.json ./infrastructure/outbox/
COPY restaurant-service-ts/restaurant-domain/package*.json ./restaurant-service-ts/restaurant-domain/
COPY restaurant-service-ts/restaurant-application/package*.json ./restaurant-service-ts/restaurant-application/
COPY restaurant-service-ts/restaurant-dataaccess/package*.json ./restaurant-service-ts/restaurant-dataaccess/
COPY restaurant-service-ts/restaurant-messaging/package*.json ./restaurant-service-ts/restaurant-messaging/
COPY restaurant-service-ts/restaurant-container/package*.json ./restaurant-service-ts/restaurant-container/

# Install dependencies
RUN cd common/common-domain && npm ci
RUN cd common/common-application && npm ci
RUN cd common/common-dataaccess && npm ci
RUN cd infrastructure/kafka-producer && npm ci
RUN cd infrastructure/kafka-consumer && npm ci
RUN cd infrastructure/kafka-model && npm ci
RUN cd infrastructure/outbox && npm ci
RUN cd restaurant-service-ts/restaurant-domain && npm ci
RUN cd restaurant-service-ts/restaurant-application && npm ci
RUN cd restaurant-service-ts/restaurant-dataaccess && npm ci
RUN cd restaurant-service-ts/restaurant-messaging && npm ci
RUN cd restaurant-service-ts/restaurant-container && npm ci

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/common ./common
COPY --from=deps /app/infrastructure ./infrastructure
COPY --from=deps /app/restaurant-service-ts ./restaurant-service-ts

# Copy source code
COPY common/common-domain ./common/common-domain
COPY common/common-application ./common/common-application
COPY common/common-dataaccess ./common/common-dataaccess
COPY infrastructure/kafka-producer ./infrastructure/kafka-producer
COPY infrastructure/kafka-consumer ./infrastructure/kafka-consumer
COPY infrastructure/kafka-model ./infrastructure/kafka-model
COPY infrastructure/outbox ./infrastructure/outbox
COPY restaurant-service-ts ./restaurant-service-ts

# Build all modules
RUN cd common/common-domain && npm run build
RUN cd common/common-application && npm run build
RUN cd common/common-dataaccess && npm run build
RUN cd infrastructure/kafka-producer && npm run build
RUN cd infrastructure/kafka-consumer && npm run build
RUN cd infrastructure/kafka-model && npm run build
RUN cd infrastructure/outbox && npm run build
RUN cd restaurant-service-ts/restaurant-domain && npm run build
RUN cd restaurant-service-ts/restaurant-application && npm run build
RUN cd restaurant-service-ts/restaurant-dataaccess && npm run build
RUN cd restaurant-service-ts/restaurant-messaging && npm run build
RUN cd restaurant-service-ts/restaurant-container && npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built files and dependencies
COPY --from=builder /app/common ./common
COPY --from=builder /app/infrastructure ./infrastructure
COPY --from=builder /app/restaurant-service-ts ./restaurant-service-ts

WORKDIR /app/restaurant-service-ts/restaurant-container

EXPOSE 8183

CMD ["node", "dist/index.js"]
