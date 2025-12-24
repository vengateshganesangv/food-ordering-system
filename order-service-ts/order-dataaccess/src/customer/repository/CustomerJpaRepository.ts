import { Repository } from 'typeorm';
import { CustomerEntity } from '../entity/CustomerEntity';

export class CustomerJpaRepository {
  constructor(private repository: Repository<CustomerEntity>) {}

  async save(customerEntity: CustomerEntity): Promise<CustomerEntity> {
    return this.repository.save(customerEntity);
  }

  async findById(id: string): Promise<CustomerEntity | null> {
    return this.repository.findOne({ where: { id } });
  }
}
