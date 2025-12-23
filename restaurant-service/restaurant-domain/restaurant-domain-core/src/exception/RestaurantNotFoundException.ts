import { DomainException } from '@food-ordering-system/common-domain';

export class RestaurantNotFoundException extends DomainException {
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = 'RestaurantNotFoundException';
  }
}
