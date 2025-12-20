import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxMessage, OrderOutboxRepository } from '@food-ordering-system/payment-application-service';
import { OrderOutboxEntity } from '../entity/OrderOutboxEntity';

@injectable()
export class OrderOutboxRepositoryImpl implements OrderOutboxRepository {
  private repository: Repository<OrderOutboxEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = dataSource.getRepository(OrderOutboxEntity);
  }

  async save(orderOutboxMessage: OrderOutboxMessage): Promise<OrderOutboxMessage> {
    const entity = this.outboxMessageToEntity(orderOutboxMessage);
    const saved = await this.repository.save(entity);
    return this.entityToOutboxMessage(saved);
  }

  async findByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<OrderOutboxMessage[]> {
    const entities = await this.repository.find({
      where: { type, outboxStatus },
    });
    return entities.map((entity) => this.entityToOutboxMessage(entity));
  }

  async findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(
    type: string,
    sagaId: string,
    paymentStatus: PaymentStatus,
    outboxStatus: OutboxStatus
  ): Promise<OrderOutboxMessage | null> {
    const entity = await this.repository.findOne({
      where: { type, sagaId, paymentStatus, outboxStatus },
    });
    return entity ? this.entityToOutboxMessage(entity) : null;
  }

  async deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void> {
    await this.repository.delete({ type, outboxStatus });
  }

  private outboxMessageToEntity(message: OrderOutboxMessage): OrderOutboxEntity {
    const entity = new OrderOutboxEntity();
    entity.id = message.id;
    entity.sagaId = message.sagaId;
    entity.createdAt = message.createdAt;
    entity.processedAt = message.processedAt;
    entity.type = message.type;
    entity.payload = message.payload;
    entity.paymentStatus = message.paymentStatus;
    entity.outboxStatus = message.outboxStatus;
    entity.version = message.version;
    return entity;
  }

  private entityToOutboxMessage(entity: OrderOutboxEntity): OrderOutboxMessage {
    return new OrderOutboxMessage({
      id: entity.id,
      sagaId: entity.sagaId,
      createdAt: entity.createdAt,
      processedAt: entity.processedAt,
      type: entity.type,
      payload: entity.payload,
      paymentStatus: entity.paymentStatus,
      outboxStatus: entity.outboxStatus,
      version: entity.version,
    });
  }
}
