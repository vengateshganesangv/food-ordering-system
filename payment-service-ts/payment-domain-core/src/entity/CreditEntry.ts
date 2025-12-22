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

  private constructor(props: CreditEntryProps) {
    super(props.creditEntryId!);
    this.customerId = props.customerId;
    this.totalCreditAmount = props.totalCreditAmount;
  }

  public addCreditAmount(amount: Money): void {
    this.totalCreditAmount = this.totalCreditAmount.add(amount);
  }

  public subtractCreditAmount(amount: Money): void {
    this.totalCreditAmount = this.totalCreditAmount.subtract(amount);
  }

  public getCustomerId(): CustomerId {
    return this.customerId;
  }

  public getTotalCreditAmount(): Money {
    return this.totalCreditAmount;
  }

  public static builder(): CreditEntryBuilder {
    return new CreditEntryBuilder();
  }
}

class CreditEntryBuilder {
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
    return new CreditEntry({
      creditEntryId: this.creditEntryId,
      customerId: this.customerId!,
      totalCreditAmount: this.totalCreditAmount!
    });
  }
}
