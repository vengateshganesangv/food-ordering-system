"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditHistoryDataAccessMapper = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const payment_domain_core_1 = require("@food-ordering-system/payment-domain-core");
const CreditHistoryEntity_1 = require("../entity/CreditHistoryEntity");
class CreditHistoryDataAccessMapper {
    creditHistoryToCreditHistoryEntity(creditHistory) {
        const entity = new CreditHistoryEntity_1.CreditHistoryEntity();
        entity.id = creditHistory.getId().getValue();
        entity.customerId = creditHistory.getCustomerId().getValue();
        entity.amount = creditHistory.getAmount().getAmount();
        entity.type = creditHistory.getTransactionType();
        return entity;
    }
    creditHistoryEntityToCreditHistory(creditHistoryEntity) {
        return payment_domain_core_1.CreditHistory.builder()
            .setCreditHistoryId(new payment_domain_core_1.CreditHistoryId(creditHistoryEntity.id))
            .setCustomerId(new common_domain_1.CustomerId(creditHistoryEntity.customerId))
            .setAmount(new common_domain_1.Money(creditHistoryEntity.amount))
            .setTransactionType(creditHistoryEntity.type)
            .build();
    }
}
exports.CreditHistoryDataAccessMapper = CreditHistoryDataAccessMapper;
