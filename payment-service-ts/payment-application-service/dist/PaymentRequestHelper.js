"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRequestHelper = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const outbox_1 = require("@food-ordering-system/outbox");
const kafka_producer_1 = require("@food-ordering-system/kafka-producer");
const payment_domain_core_1 = require("@food-ordering-system/payment-domain-core");
const PaymentApplicationServiceException_1 = require("./exception/PaymentApplicationServiceException");
const logger = new kafka_producer_1.Logger('PaymentRequestHelper');
class PaymentRequestHelper {
    constructor(paymentDomainService, paymentDataMapper, paymentRepository, creditEntryRepository, creditHistoryRepository, orderOutboxHelper, paymentResponseMessagePublisher) {
        this.paymentDomainService = paymentDomainService;
        this.paymentDataMapper = paymentDataMapper;
        this.paymentRepository = paymentRepository;
        this.creditEntryRepository = creditEntryRepository;
        this.creditHistoryRepository = creditHistoryRepository;
        this.orderOutboxHelper = orderOutboxHelper;
        this.paymentResponseMessagePublisher = paymentResponseMessagePublisher;
    }
    async persistPayment(paymentRequest) {
        if (await this.publishIfOutboxMessageProcessedForPayment(paymentRequest, common_domain_1.PaymentStatus.COMPLETED)) {
            logger.info(`An outbox message with saga id: ${paymentRequest.sagaId} is already saved to database!`);
            return;
        }
        logger.info(`Received payment complete event for order id: ${paymentRequest.orderId}`);
        const payment = this.paymentDataMapper.paymentRequestModelToPayment(paymentRequest);
        const creditEntry = await this.getCreditEntry(payment.getCustomerId());
        const creditHistories = await this.getCreditHistory(payment.getCustomerId());
        const failureMessages = [];
        const paymentEvent = this.paymentDomainService.validateAndInitiatePayment(payment, creditEntry, creditHistories, failureMessages);
        await this.persistDbObjects(payment, creditEntry, creditHistories, failureMessages);
        await this.orderOutboxHelper.saveOrderOutboxMessage(this.paymentDataMapper.paymentEventToOrderEventPayload(paymentEvent), paymentEvent.getPayment().getPaymentStatus(), outbox_1.OutboxStatus.STARTED, paymentRequest.sagaId);
    }
    async persistCancelPayment(paymentRequest) {
        if (await this.publishIfOutboxMessageProcessedForPayment(paymentRequest, common_domain_1.PaymentStatus.CANCELLED)) {
            logger.info(`An outbox message with saga id: ${paymentRequest.sagaId} is already saved to database!`);
            return;
        }
        logger.info(`Received payment rollback event for order id: ${paymentRequest.orderId}`);
        const payment = await this.paymentRepository.findByOrderId(paymentRequest.orderId);
        if (!payment) {
            logger.error(`Payment with order id: ${paymentRequest.orderId} could not be found!`);
            throw new payment_domain_core_1.PaymentNotFoundException(`Payment with order id: ${paymentRequest.orderId} could not be found!`);
        }
        const creditEntry = await this.getCreditEntry(payment.getCustomerId());
        const creditHistories = await this.getCreditHistory(payment.getCustomerId());
        const failureMessages = [];
        const paymentEvent = this.paymentDomainService.validateAndCancelPayment(payment, creditEntry, creditHistories, failureMessages);
        await this.persistDbObjects(payment, creditEntry, creditHistories, failureMessages);
        await this.orderOutboxHelper.saveOrderOutboxMessage(this.paymentDataMapper.paymentEventToOrderEventPayload(paymentEvent), paymentEvent.getPayment().getPaymentStatus(), outbox_1.OutboxStatus.STARTED, paymentRequest.sagaId);
    }
    async getCreditEntry(customerId) {
        const creditEntry = await this.creditEntryRepository.findByCustomerId(customerId);
        if (!creditEntry) {
            logger.error(`Could not find credit entry for customer: ${customerId.getValue()}`);
            throw new PaymentApplicationServiceException_1.PaymentApplicationServiceException(`Could not find credit entry for customer: ${customerId.getValue()}`);
        }
        return creditEntry;
    }
    async getCreditHistory(customerId) {
        const creditHistories = await this.creditHistoryRepository.findByCustomerId(customerId);
        if (!creditHistories || creditHistories.length === 0) {
            logger.error(`Could not find credit history for customer: ${customerId.getValue()}`);
            throw new PaymentApplicationServiceException_1.PaymentApplicationServiceException(`Could not find credit history for customer: ${customerId.getValue()}`);
        }
        return creditHistories;
    }
    async persistDbObjects(payment, creditEntry, creditHistories, failureMessages) {
        await this.paymentRepository.save(payment);
        if (failureMessages.length === 0) {
            await this.creditEntryRepository.save(creditEntry);
            await this.creditHistoryRepository.save(creditHistories[creditHistories.length - 1]);
        }
    }
    async publishIfOutboxMessageProcessedForPayment(paymentRequest, paymentStatus) {
        const orderOutboxMessage = await this.orderOutboxHelper.getCompletedOrderOutboxMessageBySagaIdAndPaymentStatus(paymentRequest.sagaId, paymentStatus);
        if (orderOutboxMessage) {
            this.paymentResponseMessagePublisher.publish(orderOutboxMessage, this.orderOutboxHelper.updateOutboxMessage.bind(this.orderOutboxHelper));
            return true;
        }
        return false;
    }
}
exports.PaymentRequestHelper = PaymentRequestHelper;
