export abstract class BaseEntity<ID> {
  private _id?: ID;

  get id(): ID {
    if (!this._id) {
      throw new Error('ID is not set');
    }
    return this._id;
  }

  set id(id: ID) {
    this._id = id;
  }

  equals(other: BaseEntity<ID>): boolean {
    if (this === other) {
      return true;
    }
    if (!other || this.constructor !== other.constructor) {
      return false;
    }
    return this._id === other._id;
  }

  hashCode(): number {
    return this._id ? this._id.toString().length : 0;
  }
}
