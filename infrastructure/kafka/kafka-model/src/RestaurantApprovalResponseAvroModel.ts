export interface RestaurantApprovalResponseAvroModel {
  id: string;
  sagaId: string;
  restaurantId: string;
  orderId: string;
  createdAt: number; // timestamp
  orderApprovalStatus: 'APPROVED' | 'REJECTED';
  failureMessages: string[];
}
