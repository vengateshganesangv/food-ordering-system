import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('customers')
export class CustomerEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  username!: string;

  @Column({ type: 'varchar', length: 255 })
  firstName!: string;

  @Column({ type: 'varchar', length: 255 })
  lastName!: string;
}
