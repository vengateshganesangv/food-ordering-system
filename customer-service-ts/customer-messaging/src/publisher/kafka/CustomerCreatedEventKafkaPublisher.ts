import { RecordMetadata } from 'kafkajs';
import { CustomerCreatedEvent } from '@food-ordering-system/customer-domain-core';
import { CustomerMessagePublisher } from '@food-ordering-system/customer-application-service';
import { CustomerServiceConfigData } from '@food-ordering-system/customer-application-service';
import { IKafkaProducer } from '@food-ordering-system/kafka-producer';
import { CustomerAvroModel } from '@food-ordering-system/kafka-model';
import { CustomerMessagingDataMapper } from '../../mapper/CustomerMessagingDataMapper';

/**
 * Customer Created Event Kafka Publisher
 * Publishes customer created events to Kafka
 */
export class CustomerCreatedEventKafkaPublisher implements CustomerMessagePublisher {
  private readonly customerMessagingDataMapper: CustomerMessagingDataMapper;
  private readonly kafkaProducer: IKafkaProducer<string, CustomerAvroModel>;
  private readonly customerServiceConfigData: CustomerServiceConfigData;

  constructor(
    customerMessagingDataMapper: CustomerMessagingDataMapper,
    kafkaProducer: IKafkaProducer<string, CustomerAvroModel>,
    customerServiceConfigData: CustomerServiceConfigData
  ) {
    this.customerMessagingDataMapper = customerMessagingDataMapper;
    this.kafkaProducer = kafkaProducer;
    this.customerServiceConfigData = customerServiceConfigData;
  }

  /**
   * Publishes a customer created event to Kafka
   * @param customerCreatedEvent - The customer created domain event
   */
  publish(customerCreatedEvent: CustomerCreatedEvent): void {
    const customerId = customerCreatedEvent.getCustomer().getId()!.getValue();
    console.log(`Received CustomerCreatedEvent for customer id: ${customerId}`);

    try {
      const customerAvroModel: CustomerAvroModel =
        this.customerMessagingDataMapper.customerCreatedEventToAvroModel(customerCreatedEvent);

      this.kafkaProducer.send(
        this.customerServiceConfigData.getCustomerTopicName(),
        customerAvroModel.id,
        customerAvroModel,
        {
          onSuccess: (metadata: RecordMetadata) => {
            console.log(
              `Received new metadata. Topic: ${metadata.topicName}; Partition ${metadata.partition}; ` +
                `Offset ${metadata.offset}; Timestamp ${metadata.baseOffset}, at time ${Date.now()}`
            );
          },
          onFailure: (error: Error) => {
            console.error(
              `Error while sending message ${JSON.stringify(customerAvroModel)} to topic ${this.customerServiceConfigData.getCustomerTopicName()}`,
              error
            );
          },
        }
      );

      console.log(`CustomerCreatedEvent sent to kafka for customer id: ${customerAvroModel.id}`);
    } catch (error) {
      console.error(
        `Error while sending CustomerCreatedEvent to kafka for customer id: ${customerId}, error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
