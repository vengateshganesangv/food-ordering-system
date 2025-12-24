import { Entity, PrimaryColumn, Column } from 'typeorm';

/**
 * Customer database entity
 * Maps to the 'customers' table in the database
 */
@Entity('customers')
export class CustomerEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  username!: string;

  @Column({ type: 'varchar', name: 'first_name' })
  firstName!: string;

  @Column({ type: 'varchar', name: 'last_name' })
  lastName!: string;

  constructor(id?: string, username?: string, firstName?: string, lastName?: string) {
    if (id) this.id = id;
    if (username) this.username = username;
    if (firstName) this.firstName = firstName;
    if (lastName) this.lastName = lastName;
  }

  getId(): string {
    return this.id;
  }

  setId(id: string): void {
    this.id = id;
  }

  getUsername(): string {
    return this.username;
  }

  setUsername(username: string): void {
    this.username = username;
  }

  getFirstName(): string {
    return this.firstName;
  }

  setFirstName(firstName: string): void {
    this.firstName = firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  setLastName(lastName: string): void {
    this.lastName = lastName;
  }
}
