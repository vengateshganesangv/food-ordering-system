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
exports.OrderApprovalEntity = void 0;
const typeorm_1 = require("typeorm");
const common_domain_1 = require("@food-ordering-system/common-domain");
/**
 * Order Approval Entity - TypeORM entity for restaurant.order_approval table
 * Represents an order approval decision made by a restaurant
 */
let OrderApprovalEntity = class OrderApprovalEntity {
};
exports.OrderApprovalEntity = OrderApprovalEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], OrderApprovalEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { name: 'restaurant_id' }),
    __metadata("design:type", String)
], OrderApprovalEntity.prototype, "restaurantId", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid', { name: 'order_id' }),
    __metadata("design:type", String)
], OrderApprovalEntity.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 50,
    }),
    __metadata("design:type", String)
], OrderApprovalEntity.prototype, "status", void 0);
exports.OrderApprovalEntity = OrderApprovalEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'order_approval', schema: 'restaurant' })
], OrderApprovalEntity);
