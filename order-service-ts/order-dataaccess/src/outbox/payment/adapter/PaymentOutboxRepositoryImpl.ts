import { OutboxStatus, SagaStatus } from '@food-ordering-system/common-domain';
import {
  OrderPaymentOutboxMessage,
  PaymentOutboxRepository,
} from '@food-ordering-system/order-application-service';
import { PaymentOutboxJpaRepository } from '../repository/PaymentOutboxJpaRepository';
import { PaymentOutboxDataAccessMapper } from '../mapper/PaymentOutboxDataAccessMapper';
import { PaymentOutboxNotFoundException } from '../exception/PaymentOutboxNotFoundException';

export class PaymentOutboxRepositoryImpl implements PaymentOutboxRepository {
  constructor(
    private readonly paymentOutboxJpaRepository: PaymentOutboxJpaRepository,
    private readonly paymentOutboxDataAccessMapper: PaymentOutboxDataAccessMapper,
  ) {}

  async save(orderPaymentOutboxMessage: OrderPaymentOutboxMessage): Promise<OrderPaymentOutboxMessage> {
    const entity = this.paymentOutboxDataAccessMapper.orderPaymentOutboxMessageToOutboxEntity(
      orderPaymentOutboxMessage,
    );
    const savedEntity = await this.paymentOutboxJpaRepository.save(entity);
    return this.paymentOutboxDataAccessMapper.paymentOutboxEntityToOrderPaymentOutboxMessage(savedEntity);
  }

  async findByTypeAndOutboxStatusAndSagaStatus(
    sagaType: string,
    outboxStatus: OutboxStatus,
    sagaStatus: SagaStatus[],
  ): Promise<OrderPaymentOutboxMessage[] | undefined> {
    const entities = await this.paymentOutboxJpaRepository.findByTypeAndOutboxStatusAndSagaStatusIn(
      sagaType,
      outboxStatus,
      sagaStatus,
    );

    if (!entities) {
      throw new PaymentOutboxNotFoundException(
        `Payment outbox object could not be found for saga type ${sagaType}`,
      );
    }

    return entities.map((entity) =>
      this.paymentOutboxDataAccessMapper.paymentOutboxEntityToOrderPaymentOutboxMessage(entity),
    );
  }

  async findByTypeAndSagaIdAndSagaStatus(
    type: string,
    sagaId: string,
    sagaStatus: SagaStatus[],
  ): Promise<OrderPaymentOutboxMessage | undefined> {
    const entity = await this.paymentOutboxJpaRepository.findByTypeAndSagaIdAndSagaStatusIn(type, sagaId, sagaStatus);
    return entity ? this.paymentOutboxDataAccessMapper.paymentOutboxEntityToOrderPaymentOutboxMessage(entity) : undefined;
  }

  async deleteByTypeAndOutboxStatusAndSagaStatus(
    type: string,
    outboxStatus: OutboxStatus,
    sagaStatus: SagaStatus[],
  ): Promise<void> {
    await this.paymentOutboxJpaRepository.deleteByTypeAndOutboxStatusAndSagaStatusIn(type, outboxStatus, sagaStatus);
  }
}
