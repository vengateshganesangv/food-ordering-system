import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxMessage, OrderOutboxRepository } from '@food-ordering-system/payment-application-service';
import { OrderOutboxJpaRepository } from '../repository/OrderOutboxJpaRepository';
import { OrderOutboxDataAccessMapper } from '../mapper/OrderOutboxDataAccessMapper';
export declare class OrderOutboxRepositoryImpl implements OrderOutboxRepository {
    private readonly orderOutboxJpaRepository;
    private readonly orderOutboxDataAccessMapper;
    constructor(orderOutboxJpaRepository: OrderOutboxJpaRepository, orderOutboxDataAccessMapper: OrderOutboxDataAccessMapper);
    save(orderOutboxMessage: OrderOutboxMessage): Promise<OrderOutboxMessage>;
    findByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<OrderOutboxMessage[]>;
    findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(type: string, sagaId: string, paymentStatus: PaymentStatus, outboxStatus: OutboxStatus): Promise<OrderOutboxMessage | null>;
    deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void>;
}
