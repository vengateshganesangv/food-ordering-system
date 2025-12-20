FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY services/customer-service/ ./services/customer-service/

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN pnpm install

# Build all packages
RUN pnpm -r build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/customer-service ./services/customer-service

WORKDIR /app/services/customer-service

EXPOSE 8081

CMD ["node", "dist/index.js"]
