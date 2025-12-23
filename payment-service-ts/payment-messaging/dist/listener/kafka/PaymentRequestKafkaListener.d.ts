import { PaymentRequestMessageListener } from '@food-ordering-system/payment-application-service';
import { PaymentMessagingDataMapper } from '../../mapper/PaymentMessagingDataMapper';
import { EachMessagePayload } from 'kafkajs';
export declare class PaymentRequestKafkaListener {
    private readonly paymentRequestMessageListener;
    private readonly paymentMessagingDataMapper;
    private logger;
    constructor(paymentRequestMessageListener: PaymentRequestMessageListener, paymentMessagingDataMapper: PaymentMessagingDataMapper);
    consume(payload: EachMessagePayload): Promise<void>;
}
