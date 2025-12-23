import { OrderOutboxMessage } from '@food-ordering-system/restaurant-application-service';
import { OrderOutboxEntity } from '../entity/OrderOutboxEntity';
/**
 * Order Outbox Data Access Mapper
 * Maps between OrderOutboxMessage domain model and OrderOutboxEntity
 */
export declare class OrderOutboxDataAccessMapper {
    /**
     * Convert OrderOutboxMessage to OrderOutboxEntity
     * @param orderOutboxMessage Domain outbox message
     * @returns TypeORM entity
     */
    orderOutboxMessageToOutboxEntity(orderOutboxMessage: OrderOutboxMessage): OrderOutboxEntity;
    /**
     * Convert OrderOutboxEntity to OrderOutboxMessage
     * @param orderOutboxEntity TypeORM entity
     * @returns Domain outbox message
     */
    orderOutboxEntityToOrderOutboxMessage(orderOutboxEntity: OrderOutboxEntity): OrderOutboxMessage;
}
