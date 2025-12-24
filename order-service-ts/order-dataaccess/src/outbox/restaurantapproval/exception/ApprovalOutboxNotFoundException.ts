export class ApprovalOutboxNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApprovalOutboxNotFoundException';
    Object.setPrototypeOf(this, ApprovalOutboxNotFoundException.prototype);
  }
}
