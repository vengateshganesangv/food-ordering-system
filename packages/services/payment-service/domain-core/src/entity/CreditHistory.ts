import { BaseEntity, CustomerId, Money } from '@food-ordering-system/common-domain';
import { CreditHistoryId } from '../valueobject/CreditHistoryId';
import { TransactionType } from '../valueobject/TransactionType';

interface CreditHistoryProps {
  creditHistoryId?: CreditHistoryId;
  customerId: CustomerId;
  amount: Money;
  transactionType: TransactionType;
}

export class CreditHistory extends BaseEntity<CreditHistoryId> {
  private readonly _customerId: CustomerId;
  private readonly _amount: Money;
  private readonly _transactionType: TransactionType;

  private constructor(props: CreditHistoryProps) {
    super();
    if (props.creditHistoryId) {
      this.setId(props.creditHistoryId);
    }
    this._customerId = props.customerId;
    this._amount = props.amount;
    this._transactionType = props.transactionType;
  }

  static builder(): CreditHistoryBuilder {
    return new CreditHistoryBuilder();
  }

  get customerId(): CustomerId {
    return this._customerId;
  }

  get amount(): Money {
    return this._amount;
  }

  get transactionType(): TransactionType {
    return this._transactionType;
  }
}

class CreditHistoryBuilder {
  private creditHistoryId?: CreditHistoryId;
  private customerId?: CustomerId;
  private amount?: Money;
  private transactionType?: TransactionType;

  setCreditHistoryId(creditHistoryId: CreditHistoryId): CreditHistoryBuilder {
    this.creditHistoryId = creditHistoryId;
    return this;
  }

  setCustomerId(customerId: CustomerId): CreditHistoryBuilder {
    this.customerId = customerId;
    return this;
  }

  setAmount(amount: Money): CreditHistoryBuilder {
    this.amount = amount;
    return this;
  }

  setTransactionType(transactionType: TransactionType): CreditHistoryBuilder {
    this.transactionType = transactionType;
    return this;
  }

  build(): CreditHistory {
    if (!this.customerId || !this.amount || !this.transactionType) {
      throw new Error('CustomerId, Amount, and TransactionType are required');
    }
    return new CreditHistory({
      creditHistoryId: this.creditHistoryId,
      customerId: this.customerId,
      amount: this.amount,
      transactionType: this.transactionType,
    });
  }
}
