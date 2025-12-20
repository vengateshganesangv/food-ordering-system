FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY services/payment-service/ ./services/payment-service/

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm -r build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/payment-service ./services/payment-service

WORKDIR /app/services/payment-service

EXPOSE 8083

CMD ["node", "dist/index.js"]
