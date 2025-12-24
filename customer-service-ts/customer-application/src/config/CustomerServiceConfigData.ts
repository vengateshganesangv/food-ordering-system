/**
 * Customer Service Configuration Data
 * Contains configuration properties for the customer service
 */
export class CustomerServiceConfigData {
  private customerTopicName: string;

  constructor(customerTopicName: string) {
    this.customerTopicName = customerTopicName;
  }

  getCustomerTopicName(): string {
    return this.customerTopicName;
  }

  setCustomerTopicName(customerTopicName: string): void {
    this.customerTopicName = customerTopicName;
  }
}
