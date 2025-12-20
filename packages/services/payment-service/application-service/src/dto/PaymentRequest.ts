import { PaymentOrderStatus } from '@food-ordering-system/common-domain';

export class PaymentRequest {
  id!: string;
  sagaId!: string;
  orderId!: string;
  customerId!: string;
  price!: number;
  createdAt!: Date;
  paymentOrderStatus!: PaymentOrderStatus;

  constructor(partial?: Partial<PaymentRequest>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
