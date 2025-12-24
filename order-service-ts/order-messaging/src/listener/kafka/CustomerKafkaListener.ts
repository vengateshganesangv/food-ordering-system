import { IKafkaConsumer } from '@food-ordering-system/kafka-consumer';
import { CustomerAvroModel } from '@food-ordering-system/kafka-model';
import { CustomerMessageListener } from '@food-ordering-system/order-application-service';
import { OrderMessagingDataMapper } from '../../mapper/OrderMessagingDataMapper';
import { Logger } from '@food-ordering-system/kafka-producer';

export class CustomerKafkaListener implements IKafkaConsumer<CustomerAvroModel> {
  private static readonly logger = new Logger('CustomerKafkaListener');

  constructor(
    private customerMessageListener: CustomerMessageListener,
    private orderMessagingDataMapper: OrderMessagingDataMapper,
  ) {}

  async receive(
    messages: CustomerAvroModel[],
    keys: string[],
    partitions: number[],
    offsets: number[],
  ): Promise<void> {
    for (let i = 0; i < messages.length; i++) {
      const customerAvroModel = messages[i];
      const key = keys[i];
      const partition = partitions[i];
      const offset = offsets[i];

      CustomerKafkaListener.logger.info(
        `Received customer create message with key ${key}, partition ${partition} and offset ${offset}`,
      );

      await this.customerMessageListener.customerCreated(
        this.orderMessagingDataMapper.customerAvroModeltoCustomerModel(customerAvroModel),
      );
    }
  }

  getGroupId(): string {
    return 'order-service-customer-group';
  }

  getTopics(): string[] {
    return ['customer'];
  }
}
