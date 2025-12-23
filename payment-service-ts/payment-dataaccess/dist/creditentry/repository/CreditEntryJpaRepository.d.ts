import { Repository } from 'typeorm';
import { CreditEntryEntity } from '../entity/CreditEntryEntity';
export declare class CreditEntryJpaRepository extends Repository<CreditEntryEntity> {
    findByCustomerId(customerId: string): Promise<CreditEntryEntity | null>;
}
