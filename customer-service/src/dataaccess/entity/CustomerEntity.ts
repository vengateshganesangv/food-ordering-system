import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('customers')
export class CustomerEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  username!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 255 })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 255 })
  lastName!: string;
}
