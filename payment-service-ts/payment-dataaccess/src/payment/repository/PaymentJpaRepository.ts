import { Repository } from 'typeorm';
import { PaymentEntity } from '../entity/PaymentEntity';

export class PaymentJpaRepository extends Repository<PaymentEntity> {
  public async findByOrderId(orderId: string): Promise<PaymentEntity | null> {
    return this.findOne({ where: { orderId } });
  }
}
