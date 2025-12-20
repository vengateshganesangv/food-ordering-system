import { DomainException } from '@food-ordering-system/common-domain';

export class OrderDomainException extends DomainException {
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'OrderDomainException';
  }
}
