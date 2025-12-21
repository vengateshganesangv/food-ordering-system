import { KafkaProducer } from '@food-ordering-system/kafka-producer';
import { CustomerAvroModel } from '@food-ordering-system/kafka-model';
import { CustomerMessagePublisher } from '../../domain/application/ports/output/message/CustomerMessagePublisher';
import { CustomerCreatedEvent } from '../../domain/core/event/CustomerCreatedEvent';
import { CustomerMessagingDataMapper } from '../mapper/CustomerMessagingDataMapper';

export class CustomerCreatedEventKafkaPublisher implements CustomerMessagePublisher {
  constructor(
    private readonly kafkaProducer: KafkaProducer<string, CustomerAvroModel>,
    private readonly customerMessagingDataMapper: CustomerMessagingDataMapper,
    private readonly topicName: string,
  ) {}

  async publish(customerCreatedEvent: CustomerCreatedEvent): Promise<void> {
    const customerId = customerCreatedEvent.customer.id.value;

    console.log(`Publishing CustomerCreatedEvent for customer id: ${customerId} to topic ${this.topicName}`);

    try {
      const customerAvroModel = this.customerMessagingDataMapper.eventToAvroModel(customerCreatedEvent);

      await this.kafkaProducer.send(
        this.topicName,
        customerId,
        customerAvroModel,
        (error, result) => {
          if (error) {
            console.error(`Error publishing customer created event for customer id: ${customerId}`, error);
          } else {
            console.log(`CustomerCreatedEvent published successfully for customer id: ${customerId}`);
          }
        },
      );
    } catch (error) {
      console.error(`Error publishing CustomerCreatedEvent for customer id: ${customerId}`, error);
      throw error;
    }
  }
}
