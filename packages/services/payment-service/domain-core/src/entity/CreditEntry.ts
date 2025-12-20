import { BaseEntity, CustomerId, Money } from '@food-ordering-system/common-domain';
import { CreditEntryId } from '../valueobject/CreditEntryId';

interface CreditEntryProps {
  creditEntryId?: CreditEntryId;
  customerId: CustomerId;
  totalCreditAmount: Money;
}

export class CreditEntry extends BaseEntity<CreditEntryId> {
  private readonly _customerId: CustomerId;
  private _totalCreditAmount: Money;

  private constructor(props: CreditEntryProps) {
    super();
    if (props.creditEntryId) {
      this.setId(props.creditEntryId);
    }
    this._customerId = props.customerId;
    this._totalCreditAmount = props.totalCreditAmount;
  }

  static builder(): CreditEntryBuilder {
    return new CreditEntryBuilder();
  }

  addCreditAmount(amount: Money): void {
    this._totalCreditAmount = this._totalCreditAmount.add(amount);
  }

  subtractCreditAmount(amount: Money): void {
    this._totalCreditAmount = this._totalCreditAmount.subtract(amount);
  }

  get customerId(): CustomerId {
    return this._customerId;
  }

  get totalCreditAmount(): Money {
    return this._totalCreditAmount;
  }
}

class CreditEntryBuilder {
  private creditEntryId?: CreditEntryId;
  private customerId?: CustomerId;
  private totalCreditAmount?: Money;

  setCreditEntryId(creditEntryId: CreditEntryId): CreditEntryBuilder {
    this.creditEntryId = creditEntryId;
    return this;
  }

  setCustomerId(customerId: CustomerId): CreditEntryBuilder {
    this.customerId = customerId;
    return this;
  }

  setTotalCreditAmount(totalCreditAmount: Money): CreditEntryBuilder {
    this.totalCreditAmount = totalCreditAmount;
    return this;
  }

  build(): CreditEntry {
    if (!this.customerId || !this.totalCreditAmount) {
      throw new Error('CustomerId and TotalCreditAmount are required');
    }
    return new CreditEntry({
      creditEntryId: this.creditEntryId,
      customerId: this.customerId,
      totalCreditAmount: this.totalCreditAmount,
    });
  }
}
