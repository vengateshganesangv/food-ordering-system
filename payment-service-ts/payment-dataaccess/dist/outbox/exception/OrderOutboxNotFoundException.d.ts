import { DomainException } from '@food-ordering-system/common-domain';
export declare class OrderOutboxNotFoundException extends DomainException {
    constructor(message: string, cause?: Error);
}
