import { DomainException } from '@food-ordering-system/common-domain';
export declare class PaymentDataaccessException extends DomainException {
    constructor(message: string, cause?: Error);
}
