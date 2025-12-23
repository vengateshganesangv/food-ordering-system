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
export declare function createRestaurantServiceConfigData(config: any): RestaurantServiceConfigData;
//# sourceMappingURL=RestaurantServiceConfigData.d.ts.map