"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxHelper = void 0;
var saga_1 = require("@food-ordering-system/saga");
var RestaurantDomainException_1 = require("../../../restaurant-domain-core/src/exception/RestaurantDomainException");
var OrderOutboxMessage_1 = require("../model/OrderOutboxMessage");
var uuid_1 = require("uuid");
/**
 * Order Outbox Helper
 * Manages CRUD operations for order outbox messages
 */
var OrderOutboxHelper = /** @class */ (function () {
    function OrderOutboxHelper(orderOutboxRepository, logger) {
        this.orderOutboxRepository = orderOutboxRepository;
        this.logger = logger || console;
    }
    /**
     * Get completed outbox message by saga ID and status
     */
    OrderOutboxHelper.prototype.getCompletedOrderOutboxMessageBySagaIdAndOutboxStatus = function (sagaId, outboxStatus) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.orderOutboxRepository.findByTypeAndSagaIdAndOutboxStatus(saga_1.ORDER_SAGA_NAME, sagaId, outboxStatus)];
            });
        });
    };
    /**
     * Get outbox messages by status
     */
    OrderOutboxHelper.prototype.getOrderOutboxMessageByOutboxStatus = function (outboxStatus) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.orderOutboxRepository.findByTypeAndOutboxStatus(saga_1.ORDER_SAGA_NAME, outboxStatus)];
            });
        });
    };
    /**
     * Delete outbox messages by status
     */
    OrderOutboxHelper.prototype.deleteOrderOutboxMessageByOutboxStatus = function (outboxStatus) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderOutboxRepository.deleteByTypeAndOutboxStatus(saga_1.ORDER_SAGA_NAME, outboxStatus)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save a new order outbox message
     */
    OrderOutboxHelper.prototype.saveOrderOutboxMessage = function (orderEventPayload, approvalStatus, outboxStatus, sagaId) {
        return __awaiter(this, void 0, void 0, function () {
            var message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = new OrderOutboxMessage_1.OrderOutboxMessage.Builder()
                            .id((0, uuid_1.v4)())
                            .sagaId(sagaId)
                            .createdAt(orderEventPayload.createdAt)
                            .processedAt(new Date())
                            .type(saga_1.ORDER_SAGA_NAME)
                            .payload(this.createPayload(orderEventPayload))
                            .approvalStatus(approvalStatus)
                            .outboxStatus(outboxStatus)
                            .version(0)
                            .build();
                        return [4 /*yield*/, this.save(message)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update outbox message status
     */
    OrderOutboxHelper.prototype.updateOutboxStatus = function (orderOutboxMessage, outboxStatus) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        orderOutboxMessage.setOutboxStatus(outboxStatus);
                        return [4 /*yield*/, this.save(orderOutboxMessage)];
                    case 1:
                        _a.sent();
                        this.logger.info("Order outbox table status is updated as: ".concat(outboxStatus));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Save outbox message to repository
     */
    OrderOutboxHelper.prototype.save = function (orderOutboxMessage) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderOutboxRepository.save(orderOutboxMessage)];
                    case 1:
                        response = _a.sent();
                        if (!response) {
                            throw new RestaurantDomainException_1.RestaurantDomainException('Could not save OrderOutboxMessage!');
                        }
                        this.logger.info("OrderOutboxMessage saved with id: ".concat(orderOutboxMessage.getId()));
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Serialize order event payload to JSON string
     */
    OrderOutboxHelper.prototype.createPayload = function (orderEventPayload) {
        try {
            return JSON.stringify(orderEventPayload);
        }
        catch (error) {
            this.logger.error('Could not create OrderEventPayload json!', error);
            throw new RestaurantDomainException_1.RestaurantDomainException('Could not create OrderEventPayload json!', error);
        }
    };
    return OrderOutboxHelper;
}());
exports.OrderOutboxHelper = OrderOutboxHelper;
