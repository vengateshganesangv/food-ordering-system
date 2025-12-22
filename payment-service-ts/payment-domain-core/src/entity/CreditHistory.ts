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
    super(props.creditHistoryId!);
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

  public static builder(): CreditHistoryBuilder {
    return new CreditHistoryBuilder();
  }
}

class CreditHistoryBuilder {
  private creditHistoryId?: CreditHistoryId;
  private customerId?: CustomerId;
  private amount?: Money;
  private transactionType?: TransactionType;

  public setCreditHistoryId(creditHistoryId: CreditHistoryId): CreditHistoryBuilder {
    this.creditHistoryId = creditHistoryId;
    return this;
  }

  public setCustomerId(customerId: CustomerId): CreditHistoryBuilder {
    this.customerId = customerId;
    return this;
  }

  public setAmount(amount: Money): CreditHistoryBuilder {
    this.amount = amount;
    return this;
  }

  public setTransactionType(transactionType: TransactionType): CreditHistoryBuilder {
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
}
