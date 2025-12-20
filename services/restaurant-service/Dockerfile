FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY services/restaurant-service/ ./services/restaurant-service/

RUN npm install -g pnpm
RUN pnpm install
RUN pnpm -r build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/services/restaurant-service ./services/restaurant-service

WORKDIR /app/services/restaurant-service

EXPOSE 8084

CMD ["node", "dist/index.js"]
