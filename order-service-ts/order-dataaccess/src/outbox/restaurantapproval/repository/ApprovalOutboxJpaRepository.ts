import { Repository, In } from 'typeorm';
import { ApprovalOutboxEntity } from '../entity/ApprovalOutboxEntity';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';

export class ApprovalOutboxJpaRepository {
  constructor(private repository: Repository<ApprovalOutboxEntity>) {}

  async save(entity: ApprovalOutboxEntity): Promise<ApprovalOutboxEntity> {
    return this.repository.save(entity);
  }

  async findByTypeAndOutboxStatusAndSagaStatusIn(
    type: string,
    outboxStatus: OutboxStatus,
    sagaStatus: SagaStatus[],
  ): Promise<ApprovalOutboxEntity[] | null> {
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
  ): Promise<ApprovalOutboxEntity | null> {
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
