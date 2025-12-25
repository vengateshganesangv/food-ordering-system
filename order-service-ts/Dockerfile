# Multi-stage build for Order Service
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
COPY infrastructure/saga/package*.json ./infrastructure/saga/
COPY infrastructure/outbox/package*.json ./infrastructure/outbox/
COPY order-service-ts/order-domain/package*.json ./order-service-ts/order-domain/
COPY order-service-ts/order-application-service/package*.json ./order-service-ts/order-application-service/
COPY order-service-ts/order-dataaccess/package*.json ./order-service-ts/order-dataaccess/
COPY order-service-ts/order-messaging/package*.json ./order-service-ts/order-messaging/
COPY order-service-ts/order-container/package*.json ./order-service-ts/order-container/

# Install dependencies
RUN cd common/common-domain && npm ci
RUN cd common/common-application && npm ci
RUN cd infrastructure/kafka/kafka-config-data && npm ci
RUN cd infrastructure/kafka/kafka-producer && npm ci
RUN cd infrastructure/kafka/kafka-consumer && npm ci
RUN cd infrastructure/kafka/kafka-model && npm ci
RUN cd infrastructure/saga && npm ci
RUN cd infrastructure/outbox && npm ci
RUN cd order-service-ts/order-domain && npm ci
RUN cd order-service-ts/order-application-service && npm ci
RUN cd order-service-ts/order-dataaccess && npm ci
RUN cd order-service-ts/order-messaging && npm ci
RUN cd order-service-ts/order-container && npm ci

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/common ./common
COPY --from=deps /app/infrastructure ./infrastructure
COPY --from=deps /app/order-service-ts ./order-service-ts

# Copy source code
COPY common/common-domain ./common/common-domain
COPY common/common-application ./common/common-application
COPY infrastructure/kafka/kafka-config-data ./infrastructure/kafka/kafka-config-data
COPY infrastructure/kafka/kafka-producer ./infrastructure/kafka/kafka-producer
COPY infrastructure/kafka/kafka-consumer ./infrastructure/kafka/kafka-consumer
COPY infrastructure/kafka/kafka-model ./infrastructure/kafka/kafka-model
COPY infrastructure/saga ./infrastructure/saga
COPY infrastructure/outbox ./infrastructure/outbox
COPY order-service-ts ./order-service-ts

# Build all modules
RUN cd common/common-domain && npm run build
RUN cd common/common-application && npm run build
RUN cd infrastructure/kafka/kafka-config-data && npm run build
RUN cd infrastructure/kafka/kafka-producer && npm run build
RUN cd infrastructure/kafka/kafka-consumer && npm run build
RUN cd infrastructure/kafka/kafka-model && npm run build
RUN cd infrastructure/saga && npm run build
RUN cd infrastructure/outbox && npm run build
RUN cd order-service-ts/order-domain && npm run build
RUN cd order-service-ts/order-application-service && npm run build
RUN cd order-service-ts/order-dataaccess && npm run build
RUN cd order-service-ts/order-messaging && npm run build
RUN cd order-service-ts/order-container && npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built files and dependencies
COPY --from=builder /app/common ./common
COPY --from=builder /app/infrastructure ./infrastructure
COPY --from=builder /app/order-service-ts ./order-service-ts

WORKDIR /app/order-service-ts/order-container

EXPOSE 8181

CMD ["node", "dist/index.js"]
