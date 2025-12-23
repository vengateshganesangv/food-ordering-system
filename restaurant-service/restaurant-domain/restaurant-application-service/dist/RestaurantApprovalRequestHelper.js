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
exports.RestaurantApprovalRequestHelper = void 0;
var common_domain_1 = require("@food-ordering-system/common-domain");
var outbox_1 = require("@food-ordering-system/outbox");
var RestaurantNotFoundException_1 = require("../../restaurant-domain-core/src/exception/RestaurantNotFoundException");
/**
 * Restaurant Approval Request Helper
 * Handles the business logic for restaurant approval requests
 */
var RestaurantApprovalRequestHelper = /** @class */ (function () {
    function RestaurantApprovalRequestHelper(restaurantDomainService, restaurantDataMapper, restaurantRepository, orderApprovalRepository, orderOutboxHelper, restaurantApprovalResponseMessagePublisher, logger) {
        this.restaurantDomainService = restaurantDomainService;
        this.restaurantDataMapper = restaurantDataMapper;
        this.restaurantRepository = restaurantRepository;
        this.orderApprovalRepository = orderApprovalRepository;
        this.orderOutboxHelper = orderOutboxHelper;
        this.restaurantApprovalResponseMessagePublisher = restaurantApprovalResponseMessagePublisher;
        this.logger = logger || console;
    }
    /**
     * Persist order approval with transaction management
     * Implements idempotency check via outbox pattern
     */
    RestaurantApprovalRequestHelper.prototype.persistOrderApproval = function (restaurantApprovalRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var failureMessages, restaurant, orderApprovalEvent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.publishIfOutboxMessageProcessed(restaurantApprovalRequest)];
                    case 1:
                        // Check if message already processed (idempotency)
                        if (_a.sent()) {
                            this.logger.info("An outbox message with saga id: ".concat(restaurantApprovalRequest.sagaId, " already saved to database!"));
                            return [2 /*return*/];
                        }
                        this.logger.info("Processing restaurant approval for order id: ".concat(restaurantApprovalRequest.orderId));
                        failureMessages = [];
                        return [4 /*yield*/, this.findRestaurant(restaurantApprovalRequest)];
                    case 2:
                        restaurant = _a.sent();
                        orderApprovalEvent = this.restaurantDomainService.validateOrder(restaurant, failureMessages);
                        // Save order approval
                        return [4 /*yield*/, this.orderApprovalRepository.save(restaurant.getOrderApproval())];
                    case 3:
                        // Save order approval
                        _a.sent();
                        // Save outbox message for reliable messaging
                        return [4 /*yield*/, this.orderOutboxHelper.saveOrderOutboxMessage(this.restaurantDataMapper.orderApprovalEventToOrderEventPayload(orderApprovalEvent), orderApprovalEvent.getOrderApproval().getApprovalStatus(), outbox_1.OutboxStatus.STARTED, restaurantApprovalRequest.sagaId)];
                    case 4:
                        // Save outbox message for reliable messaging
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Find restaurant information and enrich with product details
     */
    RestaurantApprovalRequestHelper.prototype.findRestaurant = function (restaurantApprovalRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var restaurant, restaurantResult, restaurantId, restaurantEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        restaurant = this.restaurantDataMapper.restaurantApprovalRequestToRestaurant(restaurantApprovalRequest);
                        return [4 /*yield*/, this.restaurantRepository.findRestaurantInformation(restaurant)];
                    case 1:
                        restaurantResult = _a.sent();
                        if (!restaurantResult) {
                            restaurantId = restaurant.getId().getValue();
                            this.logger.error("Restaurant with id ".concat(restaurantId, " not found!"));
                            throw new RestaurantNotFoundException_1.RestaurantNotFoundException("Restaurant with id ".concat(restaurantId, " not found!"));
                        }
                        restaurantEntity = restaurantResult;
                        restaurant.setActive(restaurantEntity.isActive());
                        // Match and update product information
                        restaurant.getOrderDetail().getProducts().forEach(function (product) {
                            restaurantEntity.getOrderDetail().getProducts().forEach(function (p) {
                                if (p.getId().equals(product.getId())) {
                                    product.updateWithConfirmedNamePriceAndAvailability(p.getName(), p.getPrice(), p.isAvailable());
                                }
                            });
                        });
                        restaurant.getOrderDetail().setId(new common_domain_1.OrderId(restaurantApprovalRequest.orderId));
                        return [2 /*return*/, restaurant];
                }
            });
        });
    };
    /**
     * Check if message already processed and publish if it was
     * Implements idempotency check
     */
    RestaurantApprovalRequestHelper.prototype.publishIfOutboxMessageProcessed = function (restaurantApprovalRequest) {
        return __awaiter(this, void 0, void 0, function () {
            var orderOutboxMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.orderOutboxHelper.getCompletedOrderOutboxMessageBySagaIdAndOutboxStatus(restaurantApprovalRequest.sagaId, outbox_1.OutboxStatus.COMPLETED)];
                    case 1:
                        orderOutboxMessage = _a.sent();
                        if (!orderOutboxMessage) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.restaurantApprovalResponseMessagePublisher.publish(orderOutboxMessage, this.orderOutboxHelper.updateOutboxStatus.bind(this.orderOutboxHelper))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/, false];
                }
            });
        });
    };
    return RestaurantApprovalRequestHelper;
}());
exports.RestaurantApprovalRequestHelper = RestaurantApprovalRequestHelper;
