"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateRoot = void 0;
const BaseEntity_1 = require("./BaseEntity");
/**
 * Aggregate root marker class in DDD
 * Aggregates are a cluster of domain objects that can be treated as a single unit
 * @template ID - The type of the aggregate root's identifier
 */
class AggregateRoot extends BaseEntity_1.BaseEntity {
}
exports.AggregateRoot = AggregateRoot;
