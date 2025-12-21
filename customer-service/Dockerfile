FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json ./
COPY common/common-domain/package.json ./common/common-domain/
COPY infrastructure/kafka/kafka-producer/package.json ./infrastructure/kafka/kafka-producer/
COPY infrastructure/kafka/kafka-model/package.json ./infrastructure/kafka/kafka-model/
COPY infrastructure/kafka/kafka-config-data/package.json ./infrastructure/kafka/kafka-config-data/
COPY customer-service/package.json ./customer-service/

# Install dependencies
RUN npm install -ws

# Copy source code
COPY common/ ./common/
COPY infrastructure/ ./infrastructure/
COPY customer-service/ ./customer-service/
COPY tsconfig.json ./

# Build all packages
RUN npm run build -w @food-ordering-system/common-domain
RUN npm run build -w @food-ordering-system/kafka-config-data
RUN npm run build -w @food-ordering-system/kafka-model
RUN npm run build -w @food-ordering-system/kafka-producer
RUN npm run build -w @food-ordering-system/customer-service

WORKDIR /app/customer-service

EXPOSE 8184

CMD ["node", "dist/index.js"]
