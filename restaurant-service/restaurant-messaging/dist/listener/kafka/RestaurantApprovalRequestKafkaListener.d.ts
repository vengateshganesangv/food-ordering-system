import { EachMessagePayload } from 'kafkajs';
import { RestaurantApprovalRequestMessageListener } from '@food-ordering-system/restaurant-application-service';
import { RestaurantMessagingDataMapper } from '../../mapper/RestaurantMessagingDataMapper';
/**
 * Restaurant Approval Request Kafka Listener
 * Consumes restaurant-approval-request messages from Kafka
 * Implements idempotency via unique constraint checking
 */
export declare class RestaurantApprovalRequestKafkaListener {
    private readonly restaurantApprovalRequestMessageListener;
    private readonly restaurantMessagingDataMapper;
    private readonly logger;
    constructor(restaurantApprovalRequestMessageListener: RestaurantApprovalRequestMessageListener, restaurantMessagingDataMapper: RestaurantMessagingDataMapper);
    /**
     * Process (consume) Kafka message
     * @param payload Kafka message payload
     */
    consume(payload: EachMessagePayload): Promise<void>;
    /**
     * Process a single approval request
     * @param avroModel Avro model from Kafka
     */
    private processApprovalRequest;
}
