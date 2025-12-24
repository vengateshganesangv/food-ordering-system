# Multi-stage build for Customer Service
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files for all dependencies
COPY common/common-domain/package*.json ./common/common-domain/
COPY common/common-application/package*.json ./common/common-application/
COPY infrastructure/kafka-producer/package*.json ./infrastructure/kafka-producer/
COPY infrastructure/kafka-consumer/package*.json ./infrastructure/kafka-consumer/
COPY infrastructure/kafka-model/package*.json ./infrastructure/kafka-model/
COPY customer-service-ts/customer-domain/package*.json ./customer-service-ts/customer-domain/
COPY customer-service-ts/customer-application/package*.json ./customer-service-ts/customer-application/
COPY customer-service-ts/customer-dataaccess/package*.json ./customer-service-ts/customer-dataaccess/
COPY customer-service-ts/customer-messaging/package*.json ./customer-service-ts/customer-messaging/
COPY customer-service-ts/customer-container/package*.json ./customer-service-ts/customer-container/

# Install dependencies
RUN cd common/common-domain && npm ci
RUN cd common/common-application && npm ci
RUN cd infrastructure/kafka-producer && npm ci
RUN cd infrastructure/kafka-consumer && npm ci
RUN cd infrastructure/kafka-model && npm ci
RUN cd customer-service-ts/customer-domain && npm ci
RUN cd customer-service-ts/customer-application && npm ci
RUN cd customer-service-ts/customer-dataaccess && npm ci
RUN cd customer-service-ts/customer-messaging && npm ci
RUN cd customer-service-ts/customer-container && npm ci

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/common ./common
COPY --from=deps /app/infrastructure ./infrastructure
COPY --from=deps /app/customer-service-ts ./customer-service-ts

# Copy source code
COPY common/common-domain ./common/common-domain
COPY common/common-application ./common/common-application
COPY infrastructure/kafka-producer ./infrastructure/kafka-producer
COPY infrastructure/kafka-consumer ./infrastructure/kafka-consumer
COPY infrastructure/kafka-model ./infrastructure/kafka-model
COPY customer-service-ts ./customer-service-ts

# Build all modules
RUN cd common/common-domain && npm run build
RUN cd common/common-application && npm run build
RUN cd infrastructure/kafka-producer && npm run build
RUN cd infrastructure/kafka-consumer && npm run build
RUN cd infrastructure/kafka-model && npm run build
RUN cd customer-service-ts/customer-domain && npm run build
RUN cd customer-service-ts/customer-application && npm run build
RUN cd customer-service-ts/customer-dataaccess && npm run build
RUN cd customer-service-ts/customer-messaging && npm run build
RUN cd customer-service-ts/customer-container && npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Copy built files and dependencies
COPY --from=builder /app/common ./common
COPY --from=builder /app/infrastructure ./infrastructure
COPY --from=builder /app/customer-service-ts ./customer-service-ts

WORKDIR /app/customer-service-ts/customer-container

EXPOSE 8184

CMD ["node", "dist/index.js"]
