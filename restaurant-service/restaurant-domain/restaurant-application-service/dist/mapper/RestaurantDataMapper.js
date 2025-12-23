"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantDataMapper = void 0;
var common_domain_1 = require("@food-ordering-system/common-domain");
var OrderDetail_1 = require("../../../restaurant-domain-core/src/entity/OrderDetail");
var Product_1 = require("../../../restaurant-domain-core/src/entity/Product");
var Restaurant_1 = require("../../../restaurant-domain-core/src/entity/Restaurant");
var OrderEventPayload_1 = require("../outbox/model/OrderEventPayload");
/**
 * Restaurant Data Mapper
 * Maps between DTOs, domain entities, and outbox messages
 */
var RestaurantDataMapper = /** @class */ (function () {
    function RestaurantDataMapper() {
    }
    /**
     * Convert RestaurantApprovalRequest DTO to Restaurant domain entity
     */
    RestaurantDataMapper.prototype.restaurantApprovalRequestToRestaurant = function (restaurantApprovalRequest) {
        var products = restaurantApprovalRequest.products.map(function (product) {
            return new Product_1.Product.Builder()
                .productId(product.getId())
                .quantity(product.getQuantity())
                .build();
        });
        var orderDetail = new OrderDetail_1.OrderDetail.Builder()
            .orderId(new common_domain_1.OrderId(restaurantApprovalRequest.orderId))
            .products(products)
            .totalAmount(new common_domain_1.Money(restaurantApprovalRequest.price))
            .orderStatus(common_domain_1.OrderStatus[restaurantApprovalRequest.restaurantOrderStatus])
            .build();
        return new Restaurant_1.Restaurant.Builder()
            .restaurantId(new common_domain_1.RestaurantId(restaurantApprovalRequest.restaurantId))
            .orderDetail(orderDetail)
            .build();
    };
    /**
     * Convert OrderApprovalEvent to OrderEventPayload for outbox
     */
    RestaurantDataMapper.prototype.orderApprovalEventToOrderEventPayload = function (orderApprovalEvent) {
        return new OrderEventPayload_1.OrderEventPayloadBuilder()
            .orderId(orderApprovalEvent.getOrderApproval().getOrderId().getValue())
            .restaurantId(orderApprovalEvent.getRestaurantId().getValue())
            .orderApprovalStatus(orderApprovalEvent.getOrderApproval().getApprovalStatus())
            .createdAt(orderApprovalEvent.getCreatedAt())
            .failureMessages(orderApprovalEvent.getFailureMessages())
            .build();
    };
    return RestaurantDataMapper;
}());
exports.RestaurantDataMapper = RestaurantDataMapper;
