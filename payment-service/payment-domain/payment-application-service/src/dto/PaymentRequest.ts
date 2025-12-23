import { PaymentOrderStatus } from '@food-ordering-system/common-domain';

export class PaymentRequest {
  id!: string;
  sagaId!: string;
  orderId!: string;
  customerId!: string;
  price!: number;
  createdAt!: Date;
  paymentOrderStatus!: PaymentOrderStatus;

  constructor(data?: Partial<PaymentRequest>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  setPaymentOrderStatus(paymentOrderStatus: PaymentOrderStatus): void {
    this.paymentOrderStatus = paymentOrderStatus;
  }
}
