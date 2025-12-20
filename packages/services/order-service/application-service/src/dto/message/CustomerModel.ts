export class CustomerModel {
  id!: string;
  username!: string;
  firstName!: string;
  lastName!: string;

  constructor(id: string, username: string, firstName: string, lastName: string) {
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
