/**
 * Order Service Configuration Data
 * Configuration for Kafka topics used by the order service
 */
export interface OrderServiceConfigData {
  paymentRequestTopicName: string;
  paymentResponseTopicName: string;
  restaurantApprovalRequestTopicName: string;
  restaurantApprovalResponseTopicName: string;
}
