import { IKafkaConsumer } from '@food-ordering-system/kafka-consumer';
import { CustomerAvroModel } from '@food-ordering-system/kafka-model';
import { CustomerMessageListener } from '@food-ordering-system/order-application-service';
import { OrderMessagingDataMapper } from '../../mapper/OrderMessagingDataMapper';
import { Logger } from '@food-ordering-system/common-domain';
import { EachMessagePayload } from 'kafkajs';

export class CustomerKafkaListener implements IKafkaConsumer<CustomerAvroModel> {
  private static readonly logger = new Logger('CustomerKafkaListener');

  constructor(
    private customerMessageListener: CustomerMessageListener,
    private orderMessagingDataMapper: OrderMessagingDataMapper,
  ) {}

  async receive(payload: EachMessagePayload): Promise<void> {
    const { message, partition } = payload;
    const key = message.key?.toString() || '';
    const offset = message.offset;

    const customerAvroModel: CustomerAvroModel = JSON.parse(message.value!.toString());

    CustomerKafkaListener.logger.info(
      `Received customer create message with key ${key}, partition ${partition} and offset ${offset}`,
    );

    await this.customerMessageListener.customerCreated(
      this.orderMessagingDataMapper.customerAvroModeltoCustomerModel(customerAvroModel),
    );
  }

  getGroupId(): string {
    return 'order-service-customer-group';
  }

  getTopics(): string[] {
    return ['customer'];
  }
}
