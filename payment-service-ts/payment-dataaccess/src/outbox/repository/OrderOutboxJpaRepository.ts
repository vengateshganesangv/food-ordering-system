import { Repository } from 'typeorm';
import { PaymentStatus, OutboxStatus } from '@food-ordering-system/common-domain';
import { OrderOutboxEntity } from '../entity/OrderOutboxEntity';

export class OrderOutboxJpaRepository extends Repository<OrderOutboxEntity> {
  public async findByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<OrderOutboxEntity[]> {
    return this.find({ where: { type, outboxStatus } });
  }

  public async findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(
    type: string,
    sagaId: string,
    paymentStatus: PaymentStatus,
    outboxStatus: OutboxStatus
  ): Promise<OrderOutboxEntity | null> {
    return this.findOne({ where: { type, sagaId, paymentStatus, outboxStatus } });
  }

  public async deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void> {
    await this.delete({ type, outboxStatus });
  }
}
