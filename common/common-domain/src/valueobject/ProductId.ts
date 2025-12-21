import { BaseId } from './BaseId';

export class ProductId extends BaseId<string> {
  constructor(value: string) {
    super(value);
  }
}
