export abstract class BaseEntity<ID> {
  private _id?: ID;

  get id(): ID | undefined {
    return this._id;
  }

  setId(id: ID): void {
    this._id = id;
  }

  equals(other: unknown): boolean {
    if (this === other) return true;
    if (!other || this.constructor !== other.constructor) return false;
    const that = other as BaseEntity<ID>;
    return this._id === that._id;
  }

  hashCode(): string {
    return this._id ? String(this._id) : '';
  }
}
