export interface PaymentResponseAvroModel {
  id: string;
  sagaId: string;
  paymentId: string;
  customerId: string;
  orderId: string;
  price: number;
  createdAt: number; // timestamp
  paymentStatus: 'COMPLETED' | 'CANCELLED' | 'FAILED';
  failureMessages: string[];
}
