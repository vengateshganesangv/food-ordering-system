import { TransactionType } from '@food-ordering-system/payment-domain-core';
export declare class CreditHistoryEntity {
    id: string;
    customerId: string;
    amount: number;
    type: TransactionType;
}
