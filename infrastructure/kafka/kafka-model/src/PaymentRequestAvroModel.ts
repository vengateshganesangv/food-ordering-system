export interface PaymentRequestAvroModel {
  id: string;
  sagaId: string;
  customerId: string;
  orderId: string;
  price: number;
  createdAt: number; // timestamp
  paymentOrderStatus: 'PENDING' | 'CANCELLED';
}
