import { IKafkaProducer, KafkaMessageHelper } from '@food-ordering-system/kafka-producer';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { RestaurantApprovalResponseMessagePublisher, OrderOutboxMessage, RestaurantServiceConfigData } from '@food-ordering-system/restaurant-application-service';
import { RestaurantMessagingDataMapper, RestaurantApprovalResponseAvroModel } from '../../mapper/RestaurantMessagingDataMapper';
/**
 * Restaurant Approval Event Kafka Publisher
 * Publishes restaurant-approval-response messages to Kafka
 * Implements the RestaurantApprovalResponseMessagePublisher output port
 */
export declare class RestaurantApprovalEventKafkaPublisher implements RestaurantApprovalResponseMessagePublisher {
    private readonly restaurantMessagingDataMapper;
    private readonly kafkaProducer;
    private readonly restaurantServiceConfigData;
    private readonly kafkaMessageHelper;
    private readonly logger;
    constructor(restaurantMessagingDataMapper: RestaurantMessagingDataMapper, kafkaProducer: IKafkaProducer<string, RestaurantApprovalResponseAvroModel>, restaurantServiceConfigData: RestaurantServiceConfigData, kafkaMessageHelper: KafkaMessageHelper);
    /**
     * Publish restaurant approval response to Kafka
     * @param orderOutboxMessage Outbox message containing the event
     * @param outboxCallback Callback to update outbox status
     */
    publish(orderOutboxMessage: OrderOutboxMessage, outboxCallback: (message: OrderOutboxMessage, status: OutboxStatus) => Promise<void>): Promise<void>;
}
