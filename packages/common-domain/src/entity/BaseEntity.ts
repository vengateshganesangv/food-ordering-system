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
    if (!other || !(other instanceof BaseEntity)) return false;
    const otherEntity = other as BaseEntity<ID>;
    return this._id === otherEntity._id;
  }
}
