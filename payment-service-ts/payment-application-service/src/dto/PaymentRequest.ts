import { PaymentOrderStatus } from '@food-ordering-system/common-domain';

export class PaymentRequest {
  constructor(
    public id: string,
    public sagaId: string,
    public orderId: string,
    public customerId: string,
    public price: number,
    public createdAt: Date,
    public paymentOrderStatus: PaymentOrderStatus
  ) {}

  public setPaymentOrderStatus(paymentOrderStatus: PaymentOrderStatus): void {
    this.paymentOrderStatus = paymentOrderStatus;
  }
}
