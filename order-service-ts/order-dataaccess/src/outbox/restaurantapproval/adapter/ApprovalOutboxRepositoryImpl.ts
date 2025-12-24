import { ApprovalOutboxJpaRepository } from '../repository/ApprovalOutboxJpaRepository';
import { ApprovalOutboxDataAccessMapper } from '../mapper/ApprovalOutboxDataAccessMapper';
import { ApprovalOutboxNotFoundException } from '../exception/ApprovalOutboxNotFoundException';
import {
  OrderApprovalOutboxMessage,
  ApprovalOutboxRepository,
} from '@food-ordering-system/order-application-service';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { SagaStatus } from '@food-ordering-system/saga';

export class ApprovalOutboxRepositoryImpl implements ApprovalOutboxRepository {
  constructor(
    private approvalOutboxJpaRepository: ApprovalOutboxJpaRepository,
    private approvalOutboxDataAccessMapper: ApprovalOutboxDataAccessMapper,
  ) {}

  async save(orderApprovalOutboxMessage: OrderApprovalOutboxMessage): Promise<OrderApprovalOutboxMessage> {
    const entity = this.approvalOutboxDataAccessMapper.orderCreatedOutboxMessageToOutboxEntity(
      orderApprovalOutboxMessage,
    );
    const savedEntity = await this.approvalOutboxJpaRepository.save(entity);
    return this.approvalOutboxDataAccessMapper.approvalOutboxEntityToOrderApprovalOutboxMessage(savedEntity);
  }

  async findByTypeAndOutboxStatusAndSagaStatus(
    sagaType: string,
    outboxStatus: OutboxStatus,
    sagaStatus: SagaStatus[],
  ): Promise<OrderApprovalOutboxMessage[] | undefined> {
    const entities = await this.approvalOutboxJpaRepository.findByTypeAndOutboxStatusAndSagaStatusIn(
      sagaType,
      outboxStatus,
      sagaStatus,
    );

    if (!entities) {
      throw new ApprovalOutboxNotFoundException(
        `Approval outbox object could be found for saga type ${sagaType}`,
      );
    }

    return entities.map((entity) =>
      this.approvalOutboxDataAccessMapper.approvalOutboxEntityToOrderApprovalOutboxMessage(entity),
    );
  }

  async findByTypeAndSagaIdAndSagaStatus(
    type: string,
    sagaId: string,
    sagaStatus: SagaStatus[],
  ): Promise<OrderApprovalOutboxMessage | undefined> {
    const entity = await this.approvalOutboxJpaRepository.findByTypeAndSagaIdAndSagaStatusIn(
      type,
      sagaId,
      sagaStatus,
    );

    if (!entity) {
      return undefined;
    }

    return this.approvalOutboxDataAccessMapper.approvalOutboxEntityToOrderApprovalOutboxMessage(entity);
  }

  async deleteByTypeAndOutboxStatusAndSagaStatus(
    type: string,
    outboxStatus: OutboxStatus,
    sagaStatus: SagaStatus[],
  ): Promise<void> {
    await this.approvalOutboxJpaRepository.deleteByTypeAndOutboxStatusAndSagaStatusIn(
      type,
      outboxStatus,
      sagaStatus,
    );
  }
}
