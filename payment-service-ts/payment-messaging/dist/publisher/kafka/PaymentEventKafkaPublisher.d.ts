import { OutboxStatus } from '@food-ordering-system/outbox';
import { KafkaMessageHelper } from '@food-ordering-system/kafka-producer';
import { PaymentResponseMessagePublisher, OrderOutboxMessage, PaymentServiceConfigData } from '@food-ordering-system/payment-application-service';
import { PaymentMessagingDataMapper, PaymentResponseAvroModel } from '../../mapper/PaymentMessagingDataMapper';
import { IKafkaProducer } from '@food-ordering-system/kafka-producer';
export declare class PaymentEventKafkaPublisher implements PaymentResponseMessagePublisher {
    private readonly paymentMessagingDataMapper;
    private readonly kafkaProducer;
    private readonly paymentServiceConfigData;
    private readonly kafkaMessageHelper;
    private logger;
    constructor(paymentMessagingDataMapper: PaymentMessagingDataMapper, kafkaProducer: IKafkaProducer<string, PaymentResponseAvroModel>, paymentServiceConfigData: PaymentServiceConfigData, kafkaMessageHelper: KafkaMessageHelper);
    publish(orderOutboxMessage: OrderOutboxMessage, outboxCallback: (orderOutboxMessage: OrderOutboxMessage, outboxStatus: OutboxStatus) => void): void;
}
