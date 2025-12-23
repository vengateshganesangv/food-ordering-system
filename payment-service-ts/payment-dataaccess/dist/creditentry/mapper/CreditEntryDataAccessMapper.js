"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditEntryDataAccessMapper = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const payment_domain_core_1 = require("@food-ordering-system/payment-domain-core");
const CreditEntryEntity_1 = require("../entity/CreditEntryEntity");
class CreditEntryDataAccessMapper {
    creditEntryToCreditEntryEntity(creditEntry) {
        const entity = new CreditEntryEntity_1.CreditEntryEntity();
        entity.id = creditEntry.getId().getValue();
        entity.customerId = creditEntry.getCustomerId().getValue();
        entity.totalCreditAmount = creditEntry.getTotalCreditAmount().getAmount();
        return entity;
    }
    creditEntryEntityToCreditEntry(creditEntryEntity) {
        return payment_domain_core_1.CreditEntry.builder()
            .setCreditEntryId(new payment_domain_core_1.CreditEntryId(creditEntryEntity.id))
            .setCustomerId(new common_domain_1.CustomerId(creditEntryEntity.customerId))
            .setTotalCreditAmount(new common_domain_1.Money(creditEntryEntity.totalCreditAmount))
            .build();
    }
}
exports.CreditEntryDataAccessMapper = CreditEntryDataAccessMapper;
