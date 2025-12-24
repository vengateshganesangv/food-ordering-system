import { DomainException } from '@food-ordering-system/common-domain';

/**
 * Order Domain Exception
 * Thrown when domain rules are violated
 */
export class OrderDomainException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'OrderDomainException';
  }
}
