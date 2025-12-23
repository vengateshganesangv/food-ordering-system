"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestaurantServiceConfigData = createRestaurantServiceConfigData;
/**
 * Factory function to create RestaurantServiceConfigData from environment or config
 */
function createRestaurantServiceConfigData(config) {
    return {
        restaurantApprovalRequestTopicName: config.restaurantApprovalRequestTopicName ||
            process.env.RESTAURANT_APPROVAL_REQUEST_TOPIC_NAME ||
            'restaurant-approval-request',
        restaurantApprovalResponseTopicName: config.restaurantApprovalResponseTopicName ||
            process.env.RESTAURANT_APPROVAL_RESPONSE_TOPIC_NAME ||
            'restaurant-approval-response',
    };
}
