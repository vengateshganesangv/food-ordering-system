export interface Product {
  id: string;
  quantity: number;
}

export interface RestaurantApprovalRequestAvroModel {
  id: string;
  sagaId: string;
  restaurantId: string;
  orderId: string;
  restaurantOrderStatus: 'PAID';
  products: Product[];
  price: number;
  createdAt: number; // timestamp
}
