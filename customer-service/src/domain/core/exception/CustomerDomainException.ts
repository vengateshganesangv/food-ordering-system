import { DomainException } from '@food-ordering-system/common-domain';

export class CustomerDomainException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'CustomerDomainException';
  }
}
