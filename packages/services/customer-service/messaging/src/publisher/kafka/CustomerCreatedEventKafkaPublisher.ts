import { injectable, inject } from 'inversify';
import { CustomerCreatedEvent } from '@food-ordering-system/customer-service-domain-core';
import { CustomerMessagePublisher, TYPES } from '@food-ordering-system/customer-service-application-service';
import { CustomerMessagingDataMapper, CustomerAvroModel } from '../../mapper/CustomerMessagingDataMapper';

@injectable()
export class CustomerCreatedEventKafkaPublisher implements CustomerMessagePublisher {
  constructor(
    @inject(TYPES.CustomerMessagingDataMapper) private readonly customerMessagingDataMapper: CustomerMessagingDataMapper,
    @inject('KafkaProducer') private readonly kafkaProducer: any,
    @inject('CustomerTopicName') private readonly customerTopicName: string
  ) {}

  async publish(customerCreatedEvent: CustomerCreatedEvent): Promise<void> {
    console.log(
      `Received CustomerCreatedEvent for customer id: ${customerCreatedEvent.customer.getId()?.getValue()}`
    );

    try {
      const customerAvroModel: CustomerAvroModel = this.customerMessagingDataMapper.customerCreatedEventToAvroModel(
        customerCreatedEvent
      );

      // Send to Kafka
      await this.kafkaProducer.send(this.customerTopicName, customerAvroModel.id, customerAvroModel);

      console.log(`CustomerCreatedEvent sent to kafka for customer id: ${customerAvroModel.id}`);
    } catch (error) {
      console.error(
        `Error while sending CustomerCreatedEvent to kafka for customer id: ${customerCreatedEvent.customer.getId()?.getValue()}, error: ${error}`
      );
      throw error;
    }
  }
}
