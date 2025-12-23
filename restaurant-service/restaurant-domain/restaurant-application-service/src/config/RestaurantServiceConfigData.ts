/**
 * Restaurant Service Configuration Data
 * Contains Kafka topic names for restaurant approval process
 */
export interface RestaurantServiceConfigData {
  restaurantApprovalRequestTopicName: string;
  restaurantApprovalResponseTopicName: string;
}

/**
 * Factory function to create RestaurantServiceConfigData from environment or config
 */
export function createRestaurantServiceConfigData(config: any): RestaurantServiceConfigData {
  return {
    restaurantApprovalRequestTopicName:
      config.restaurantApprovalRequestTopicName ||
      process.env.RESTAURANT_APPROVAL_REQUEST_TOPIC_NAME ||
      'restaurant-approval-request',
    restaurantApprovalResponseTopicName:
      config.restaurantApprovalResponseTopicName ||
      process.env.RESTAURANT_APPROVAL_RESPONSE_TOPIC_NAME ||
      'restaurant-approval-response',
  };
}
