import { BaseEntity, CustomerId, Money } from '@food-ordering-system/common-domain';
import { CreditHistoryId } from '../valueobject/CreditHistoryId';
import { TransactionType } from '../valueobject/TransactionType';

export interface CreditHistoryProps {
  creditHistoryId?: CreditHistoryId;
  customerId: CustomerId;
  amount: Money;
  transactionType: TransactionType;
}

export class CreditHistory extends BaseEntity<CreditHistoryId> {
  private readonly customerId: CustomerId;
  private readonly amount: Money;
  private readonly transactionType: TransactionType;

  private constructor(props: CreditHistoryProps) {
    super();
    if (props.creditHistoryId) {
      this.setId(props.creditHistoryId);
    }
    this.customerId = props.customerId;
    this.amount = props.amount;
    this.transactionType = props.transactionType;
  }

  public getCustomerId(): CustomerId {
    return this.customerId;
  }

  public getAmount(): Money {
    return this.amount;
  }

  public getTransactionType(): TransactionType {
    return this.transactionType;
  }

  public static builder(): InstanceType<typeof CreditHistory.Builder> {
    return new CreditHistory.Builder();
  }

  static Builder = class {
    public creditHistoryId?: CreditHistoryId;
    public customerId?: CustomerId;
    public amount?: Money;
    public transactionType?: TransactionType;

    public setCreditHistoryId(creditHistoryId: CreditHistoryId): this {
      this.creditHistoryId = creditHistoryId;
      return this;
    }

    public setCustomerId(customerId: CustomerId): this {
      this.customerId = customerId;
      return this;
    }

    public setAmount(amount: Money): this {
      this.amount = amount;
      return this;
    }

    public setTransactionType(transactionType: TransactionType): this {
      this.transactionType = transactionType;
      return this;
    }

    public build(): CreditHistory {
      return new CreditHistory({
        creditHistoryId: this.creditHistoryId,
        customerId: this.customerId!,
        amount: this.amount!,
        transactionType: this.transactionType!
      });
    }
  };
}
