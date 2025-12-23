import { OrderOutboxMessage } from '@food-ordering-system/payment-application-service';
import { OrderOutboxEntity } from '../entity/OrderOutboxEntity';
export declare class OrderOutboxDataAccessMapper {
    orderOutboxMessageToOutboxEntity(orderOutboxMessage: OrderOutboxMessage): OrderOutboxEntity;
    orderOutboxEntityToOrderOutboxMessage(orderOutboxEntity: OrderOutboxEntity): OrderOutboxMessage;
}
