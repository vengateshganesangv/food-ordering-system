import { Repository } from 'typeorm';
import { CreditHistoryEntity } from '../entity/CreditHistoryEntity';

export class CreditHistoryJpaRepository extends Repository<CreditHistoryEntity> {
  public async findByCustomerId(customerId: string): Promise<CreditHistoryEntity[]> {
    return this.find({ where: { customerId } });
  }
}
