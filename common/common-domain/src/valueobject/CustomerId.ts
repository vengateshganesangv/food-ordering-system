import { BaseId } from './BaseId';

export class CustomerId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
