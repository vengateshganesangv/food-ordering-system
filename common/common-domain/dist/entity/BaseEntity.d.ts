/**
 * Base entity class with identity
 * @template ID - The type of the entity's identifier
 */
export declare abstract class BaseEntity<ID> {
    private _id?;
    getId(): ID | undefined;
    setId(id: ID): void;
    /**
     * Checks equality based on ID
     * Two entities are equal if they have the same ID and are of the same type
     */
    equals(other: unknown): boolean;
    /**
     * Generates hash code based on ID
     */
    hashCode(): number;
}
//# sourceMappingURL=BaseEntity.d.ts.map