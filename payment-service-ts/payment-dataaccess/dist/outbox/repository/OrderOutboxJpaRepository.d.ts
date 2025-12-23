import { Repository } from 'typeorm';
import { PaymentStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { OrderOutboxEntity } from '../entity/OrderOutboxEntity';
export declare class OrderOutboxJpaRepository extends Repository<OrderOutboxEntity> {
    findByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<OrderOutboxEntity[]>;
    findByTypeAndSagaIdAndPaymentStatusAndOutboxStatus(type: string, sagaId: string, paymentStatus: PaymentStatus, outboxStatus: OutboxStatus): Promise<OrderOutboxEntity | null>;
    deleteByTypeAndOutboxStatus(type: string, outboxStatus: OutboxStatus): Promise<void>;
}
