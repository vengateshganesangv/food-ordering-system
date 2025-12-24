import { DomainException } from '@food-ordering-system/common-domain';

/**
 * Order Not Found Exception
 * Thrown when an order cannot be found
 */
export class OrderNotFoundException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'OrderNotFoundException';
  }
}
