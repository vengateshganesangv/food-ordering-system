import { PaymentStatus, OutboxStatus } from '@food-ordering-system/common-domain';
import { OrderOutboxMessage, OrderOutboxRepository } from '@food-ordering-system/payment-application-service';
import { OrderOutboxJpaRepository } from '../repository/OrderOutboxJpaRepository';
import { OrderOutboxDataAccessMapper } from '../mapper/OrderOutboxDataAccessMapper';
import { OrderOutboxNotFoundException } from '../exception/OrderOutboxNotFoundException';

export class OrderOutboxRepositoryImpl implements OrderOutboxRepository {
  constructor(
    private readonly orderOutboxJpaRepository: OrderOutboxJpaRepository,
    private readonly orderOutboxDataAccessMapper: OrderOutboxDataAccessMapper
  ) {}

  public async save(orderOutboxMessage: OrderOutboxMessage): Promise<OrderOutboxMessage> {
    const entity = this.orderOutboxDataAccessMapper.orderOutboxMessageToOutboxEntity(orderOutboxMessage);
    const savedEntity = await this.orderOutboxJpaRepository.save(entity);
    return this.orderOutboxDataAccessMapper.orderOutboxEntityToOrderOutboxMessage(savedEntity);
  }

  public async findByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<OrderOutboxMessage[]> {
    const entities = await this.orderOutboxJpaRepository.findByTypeAndOutboxStatus(type, outboxStatus);
    if (!entities || entities.length === 0) {
      throw new OrderOutboxNotFoundException(`Approval outbox object cannot be found for saga type ${type}`);
    }
    return entities.map(entity => this.orderOutboxDataAccessMapper.orderOutboxEntityToOrderOutboxMessage(entity));
  }

  public async findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(
    type: string,
    sagaId: string,
    paymentStatus: PaymentStatus,
    outboxStatus: OutboxStatus
  ): Promise<OrderOutboxMessage | null> {
    const entity = await this.orderOutboxJpaRepository.findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(
      type,
      sagaId,
      paymentStatus,
      outboxStatus
    );
    return entity ? this.orderOutboxDataAccessMapper.orderOutboxEntityToOrderOutboxMessage(entity) : null;
  }

  public async deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void> {
    await this.orderOutboxJpaRepository.deleteByTypeAndOutboxStatus(type, outboxStatus);
  }
}
