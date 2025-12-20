import { DomainException } from '@food-ordering/common-domain';

export class CustomerDomainException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerDomainException';
    Object.setPrototypeOf(this, CustomerDomainException.prototype);
  }
}
