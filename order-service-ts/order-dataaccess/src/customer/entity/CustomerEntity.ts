import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'customers', schema: 'customer' })
export class CustomerEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column('varchar', { length: 255 })
  username!: string;

  @Column('varchar', { length: 255, name: 'first_name' })
  firstName!: string;

  @Column('varchar', { length: 255, name: 'last_name' })
  lastName!: string;
}
