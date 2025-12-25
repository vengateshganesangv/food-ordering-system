# Multi-stage build for Payment Service
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files for all dependencies
COPY common/common-domain/package*.json ./common/common-domain/
COPY common/common-application/package*.json ./common/common-application/
COPY infrastructure/kafka/kafka-config-data/package*.json ./infrastructure/kafka/kafka-config-data/
COPY infrastructure/kafka/kafka-producer/package*.json ./infrastructure/kafka/kafka-producer/
COPY infrastructure/kafka/kafka-consumer/package*.json ./infrastructure/kafka/kafka-consumer/
COPY infrastructure/kafka/kafka-model/package*.json ./infrastructure/kafka/kafka-model/
COPY infrastructure/outbox/package*.json ./infrastructure/outbox/
COPY infrastructure/saga/package*.json ./infrastructure/saga/
COPY payment-service-ts/payment-domain/package*.json ./payment-service-ts/payment-domain/
COPY payment-service-ts/payment-application/package*.json ./payment-service-ts/payment-application/
COPY payment-service-ts/payment-dataaccess/package*.json ./payment-service-ts/payment-dataaccess/
COPY payment-service-ts/payment-messaging/package*.json ./payment-service-ts/payment-messaging/
COPY payment-service-ts/payment-container/package*.json ./payment-service-ts/payment-container/

# Install dependencies
RUN cd common/common-domain && npm ci
RUN cd common/common-application && npm ci
RUN cd infrastructure/kafka/kafka-config-data && npm ci
RUN cd infrastructure/kafka/kafka-producer && npm ci
RUN cd infrastructure/kafka/kafka-consumer && npm ci
RUN cd infrastructure/kafka/kafka-model && npm ci
RUN cd infrastructure/outbox && npm ci
RUN cd infrastructure/saga && npm ci
RUN cd payment-service-ts/payment-domain && npm ci
RUN cd payment-service-ts/payment-application && npm ci
RUN cd payment-service-ts/payment-dataaccess && npm ci
RUN cd payment-service-ts/payment-messaging && npm ci
RUN cd payment-service-ts/payment-container && npm ci

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/common ./common
COPY --from=deps /app/infrastructure ./infrastructure
COPY --from=deps /app/payment-service-ts ./payment-service-ts

# Copy source code
COPY common/common-domain ./common/common-domain
COPY common/common-application ./common/common-application
COPY infrastructure/kafka/kafka-config-data ./infrastructure/kafka/kafka-config-data
COPY infrastructure/kafka/kafka-producer ./infrastructure/kafka/kafka-producer
COPY infrastructure/kafka/kafka-consumer ./infrastructure/kafka/kafka-consumer
COPY infrastructure/kafka/kafka-model ./infrastructure/kafka/kafka-model
COPY infrastructure/outbox ./infrastructure/outbox
COPY infrastructure/saga ./infrastructure/saga
COPY payment-service-ts ./payment-service-ts

# Build all modules
RUN cd common/common-domain && npm run build
RUN cd common/common-application && npm run build
RUN cd infrastructure/kafka/kafka-config-data && npm run build
RUN cd infrastructure/kafka/kafka-producer && npm run build
RUN cd infrastructure/kafka/kafka-consumer && npm run build
RUN cd infrastructure/kafka/kafka-model && npm run build
RUN cd infrastructure/outbox && npm run build
RUN cd infrastructure/saga && npm run build
RUN cd payment-service-ts/payment-domain && npm run build
RUN cd payment-service-ts/payment-application && npm run build
RUN cd payment-service-ts/payment-dataaccess && npm run build
RUN cd payment-service-ts/payment-messaging && npm run build
RUN cd payment-service-ts/payment-container && npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built files and dependencies
COPY --from=builder /app/common ./common
COPY --from=builder /app/infrastructure ./infrastructure
COPY --from=builder /app/payment-service-ts ./payment-service-ts

WORKDIR /app/payment-service-ts/payment-container

EXPOSE 8182

CMD ["node", "dist/index.js"]
