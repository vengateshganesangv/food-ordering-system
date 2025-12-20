import { KafkaProducer } from '@food-ordering/kafka-producer';
import { CustomerCreatedEvent } from '../../domain-core/event/CustomerCreatedEvent';
import { CustomerMessagePublisher } from '../../application-service/ports/output/message/CustomerMessagePublisher';

export class CustomerCreatedEventKafkaPublisher implements CustomerMessagePublisher {
  constructor(
    private readonly kafkaProducer: KafkaProducer<string, unknown>,
    private readonly topicName: string,
  ) {}

  publish(event: CustomerCreatedEvent): void {
    const customer = event.customer;
    const payload = {
      customerId: customer.id!.getValue(),
      username: customer.getUsername(),
      firstName: customer.getFirstName(),
      lastName: customer.getLastName(),
    };

    this.kafkaProducer.send(this.topicName, customer.id!.getValue(), payload, (error) => {
      if (error) {
        console.error('Error publishing customer created event:', error);
      } else {
        console.log('Customer created event published successfully');
      }
    });
  }
}
