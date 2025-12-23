"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderOutboxEntity = void 0;
const typeorm_1 = require("typeorm");
const outbox_1 = require("@food-ordering-system/outbox");
const common_domain_1 = require("@food-ordering-system/common-domain");
/**
 * Order Outbox Entity - TypeORM entity for restaurant.order_outbox table
 * Implements the Outbox pattern for reliable message publishing
 */
let OrderOutboxEntity = class OrderOutboxEntity {
    equals(other) {
        if (!other)
            return false;
        if (this === other)
            return true;
        return this.id === other.id;
    }
    hashCode() {
        return this.id ? this.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
    }
};
exports.OrderOutboxEntity = OrderOutboxEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], OrderOutboxEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { name: 'saga_id' }),
    __metadata("design:type", String)
], OrderOutboxEntity.prototype, "sagaId", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { name: 'created_at' }),
    __metadata("design:type", Date)
], OrderOutboxEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp with time zone', { name: 'processed_at', nullable: true }),
    __metadata("design:type", Date)
], OrderOutboxEntity.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { length: 255 }),
    __metadata("design:type", String)
], OrderOutboxEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], OrderOutboxEntity.prototype, "payload", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        name: 'outbox_status',
    }),
    __metadata("design:type", String)
], OrderOutboxEntity.prototype, "outboxStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
        name: 'approval_status',
    }),
    __metadata("design:type", String)
], OrderOutboxEntity.prototype, "approvalStatus", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], OrderOutboxEntity.prototype, "version", void 0);
exports.OrderOutboxEntity = OrderOutboxEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'order_outbox', schema: 'restaurant' })
], OrderOutboxEntity);
