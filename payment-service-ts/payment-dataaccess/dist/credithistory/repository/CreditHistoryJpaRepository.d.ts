import { Repository } from 'typeorm';
import { CreditHistoryEntity } from '../entity/CreditHistoryEntity';
export declare class CreditHistoryJpaRepository extends Repository<CreditHistoryEntity> {
    findByCustomerId(customerId: string): Promise<CreditHistoryEntity[]>;
}
