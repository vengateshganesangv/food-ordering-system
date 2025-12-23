"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cron = __importStar(require("node-cron"));
const ConfigLoader_1 = require("./config/ConfigLoader");
const DependencyContainer_1 = require("./config/DependencyContainer");
const kafka_producer_1 = require("@food-ordering-system/kafka-producer");
const logger = new kafka_producer_1.Logger('PaymentServiceApplication');
async function bootstrap() {
    try {
        // Load configuration
        const config = ConfigLoader_1.ConfigLoader.loadConfig();
        logger.info('Configuration loaded successfully');
        // Setup dependency injection
        await DependencyContainer_1.DependencyContainer.setup();
        logger.info('Dependency injection container initialized');
        // Create Express app
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        // Health check endpoint
        app.get('/health', (req, res) => {
            res.status(200).json({ status: 'UP', service: 'payment-service' });
        });
        // Get schedulers from DependencyContainer
        const orderOutboxScheduler = DependencyContainer_1.DependencyContainer.getOrderOutboxScheduler();
        const orderOutboxCleanerScheduler = DependencyContainer_1.DependencyContainer.getOrderOutboxCleanerScheduler();
        // Schedule outbox processor (every 10 seconds based on config)
        const schedulerInterval = Math.floor(config.paymentService.outboxSchedulerFixedRate / 1000);
        cron.schedule(`*/${schedulerInterval} * * * * *`, async () => {
            try {
                await orderOutboxScheduler.processOutboxMessage();
            }
            catch (error) {
                logger.error('Error processing outbox messages:', error);
            }
        });
        // Schedule outbox cleaner (daily at midnight)
        cron.schedule('0 0 * * *', async () => {
            try {
                await orderOutboxCleanerScheduler.processOutboxMessage();
            }
            catch (error) {
                logger.error('Error cleaning outbox messages:', error);
            }
        });
        logger.info('Schedulers initialized');
        // Start server
        const port = config.server.port;
        app.listen(port, () => {
            logger.info(`Payment Service is running on port ${port}`);
        });
        // Graceful shutdown
        process.on('SIGTERM', async () => {
            logger.info('SIGTERM signal received: closing HTTP server');
            process.exit(0);
        });
        process.on('SIGINT', async () => {
            logger.info('SIGINT signal received: closing HTTP server');
            process.exit(0);
        });
    }
    catch (error) {
        logger.error('Failed to start Payment Service:', error);
        process.exit(1);
    }
}
bootstrap();
