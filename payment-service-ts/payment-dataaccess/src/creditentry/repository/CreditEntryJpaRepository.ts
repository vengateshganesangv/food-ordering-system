import { Repository } from 'typeorm';
import { CreditEntryEntity } from '../entity/CreditEntryEntity';

export class CreditEntryJpaRepository extends Repository<CreditEntryEntity> {
  public async findByCustomerId(customerId: string): Promise<CreditEntryEntity | null> {
    return this.findOne({ where: { customerId } });
  }
}
