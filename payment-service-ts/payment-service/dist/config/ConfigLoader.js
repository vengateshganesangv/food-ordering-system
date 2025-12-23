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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigLoader = void 0;
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
const path = __importStar(require("path"));
class ConfigLoader {
    static loadConfig(configPath) {
        if (this.config) {
            return this.config;
        }
        const filePath = configPath || path.join(__dirname, 'application-config.yml');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const rawConfig = yaml.load(fileContents);
        this.config = {
            server: {
                port: rawConfig.server?.port || 8182
            },
            logging: {
                level: {
                    root: rawConfig.logging?.level?.root || 'INFO'
                }
            },
            paymentService: {
                paymentRequestTopicName: rawConfig['payment-service']['payment-request-topic-name'],
                paymentResponseTopicName: rawConfig['payment-service']['payment-response-topic-name'],
                outboxSchedulerFixedRate: rawConfig['payment-service']['outbox-scheduler-fixed-rate'],
                outboxSchedulerInitialDelay: rawConfig['payment-service']['outbox-scheduler-initial-delay']
            },
            database: {
                host: rawConfig.database.host,
                port: rawConfig.database.port,
                database: rawConfig.database.database,
                schema: rawConfig.database.schema,
                username: rawConfig.database.username,
                password: rawConfig.database.password
            },
            kafkaConfig: {
                bootstrapServers: rawConfig['kafka-config']['bootstrap-servers'],
                schemaRegistryUrl: rawConfig['kafka-config']['schema-registry-url'],
                numOfPartitions: rawConfig['kafka-config']['num-of-partitions'],
                replicationFactor: rawConfig['kafka-config']['replication-factor']
            },
            kafkaConsumerConfig: {
                paymentConsumerGroupId: rawConfig['kafka-consumer-config']['payment-consumer-group-id'],
                autoOffsetReset: rawConfig['kafka-consumer-config']['auto-offset-reset'],
                batchListener: rawConfig['kafka-consumer-config']['batch-listener'],
                autoStartup: rawConfig['kafka-consumer-config']['auto-startup'],
                concurrencyLevel: rawConfig['kafka-consumer-config']['concurrency-level'],
                sessionTimeoutMs: rawConfig['kafka-consumer-config']['session-timeout-ms'],
                heartbeatIntervalMs: rawConfig['kafka-consumer-config']['heartbeat-interval-ms'],
                maxPollIntervalMs: rawConfig['kafka-consumer-config']['max-poll-interval-ms'],
                maxPollRecords: rawConfig['kafka-consumer-config']['max-poll-records'],
                pollTimeoutMs: rawConfig['kafka-consumer-config']['poll-timeout-ms']
            }
        };
        return this.config;
    }
    static getConfig() {
        if (!this.config) {
            return this.loadConfig();
        }
        return this.config;
    }
}
exports.ConfigLoader = ConfigLoader;
