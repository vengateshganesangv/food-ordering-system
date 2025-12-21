import { Repository } from 'typeorm';
import { CustomerEntity } from '../entity/CustomerEntity';

export interface CustomerJpaRepository extends Repository<CustomerEntity> {
  findByUsername(username: string): Promise<CustomerEntity | null>;
}
