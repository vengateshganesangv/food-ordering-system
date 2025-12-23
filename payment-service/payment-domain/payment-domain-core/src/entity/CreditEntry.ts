import { BaseEntity, CustomerId, Money } from '@food-ordering-system/common-domain';
import { CreditEntryId } from '../valueobject/CreditEntryId';

export interface CreditEntryProps {
  creditEntryId?: CreditEntryId;
  customerId: CustomerId;
  totalCreditAmount: Money;
}

export class CreditEntry extends BaseEntity<CreditEntryId> {
  private readonly customerId: CustomerId;
  private totalCreditAmount: Money;

  public constructor(props: CreditEntryProps) {
    super();
    if (props.creditEntryId) {
      this.setId(props.creditEntryId);
    }
    this.customerId = props.customerId;
    this.totalCreditAmount = props.totalCreditAmount;
  }

  public addCreditAmount(amount: Money): void {
    this.totalCreditAmount = this.totalCreditAmount.add(amount);
  }

  public subtractCreditAmount(amount: Money): void {
    this.totalCreditAmount = this.totalCreditAmount.subtract(amount);
  }

  public static builder(): CreditEntryBuilder {
    return new CreditEntryBuilder();
  }

  // Getters
  public getCustomerId(): CustomerId {
    return this.customerId;
  }

  public getTotalCreditAmount(): Money {
    return this.totalCreditAmount;
  }
}

export class CreditEntryBuilder {
  private creditEntryId?: CreditEntryId;
  private customerId?: CustomerId;
  private totalCreditAmount?: Money;

  public setCreditEntryId(creditEntryId: CreditEntryId): CreditEntryBuilder {
    this.creditEntryId = creditEntryId;
    return this;
  }

  public setCustomerId(customerId: CustomerId): CreditEntryBuilder {
    this.customerId = customerId;
    return this;
  }

  public setTotalCreditAmount(totalCreditAmount: Money): CreditEntryBuilder {
    this.totalCreditAmount = totalCreditAmount;
    return this;
  }

  public build(): CreditEntry {
    if (!this.customerId || !this.totalCreditAmount) {
      throw new Error('CustomerId and TotalCreditAmount are required to build CreditEntry');
    }

    return new CreditEntry({
      creditEntryId: this.creditEntryId,
      customerId: this.customerId,
      totalCreditAmount: this.totalCreditAmount,
    });
  }
}
