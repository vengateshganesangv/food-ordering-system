import { In, Repository } from 'typeorm';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';
import { PaymentOutboxEntity } from '../entity/PaymentOutboxEntity';

export class PaymentOutboxJpaRepository {
  constructor(private repository: Repository<PaymentOutboxEntity>) {}

  async save(entity: PaymentOutboxEntity): Promise<PaymentOutboxEntity> {
    return this.repository.save(entity);
  }

  async findByTypeAndOutboxStatusAndSagaStatusIn(
    type: string,
    outboxStatus: OutboxStatus,
    sagaStatus: SagaStatus[],
  ): Promise<PaymentOutboxEntity[] | null> {
    const results = await this.repository.find({
      where: {
        type,
        outboxStatus,
        sagaStatus: In(sagaStatus),
      },
    });
    return results.length > 0 ? results : null;
  }

  async findByTypeAndSagaIdAndSagaStatusIn(
    type: string,
    sagaId: string,
    sagaStatus: SagaStatus[],
  ): Promise<PaymentOutboxEntity | null> {
    return this.repository.findOne({
      where: {
        type,
        sagaId,
        sagaStatus: In(sagaStatus),
      },
    });
  }

  async deleteByTypeAndOutboxStatusAndSagaStatusIn(
    type: string,
    outboxStatus: OutboxStatus,
    sagaStatus: SagaStatus[],
  ): Promise<void> {
    await this.repository.delete({
      type,
      outboxStatus,
      sagaStatus: In(sagaStatus),
    });
  }
}
