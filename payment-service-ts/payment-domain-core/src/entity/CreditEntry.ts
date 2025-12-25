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

  public getCustomerId(): CustomerId {
    return this.customerId;
  }

  public getTotalCreditAmount(): Money {
    return this.totalCreditAmount;
  }

  public static builder(): InstanceType<typeof CreditEntry.Builder> {
    return new CreditEntry.Builder();
  }

  static Builder = class {
    public creditEntryId?: CreditEntryId;
    public customerId?: CustomerId;
    public totalCreditAmount?: Money;

    public setCreditEntryId(creditEntryId: CreditEntryId): this {
      this.creditEntryId = creditEntryId;
      return this;
    }

    public setCustomerId(customerId: CustomerId): this {
      this.customerId = customerId;
      return this;
    }

    public setTotalCreditAmount(totalCreditAmount: Money): this {
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
  };
}
