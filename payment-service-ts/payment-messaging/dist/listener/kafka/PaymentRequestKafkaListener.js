"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRequestKafkaListener = void 0;
const common_domain_1 = require("@food-ordering-system/common-domain");
const kafka_producer_1 = require("@food-ordering-system/kafka-producer");
const payment_application_service_1 = require("@food-ordering-system/payment-application-service");
const payment_domain_core_1 = require("@food-ordering-system/payment-domain-core");
class PaymentRequestKafkaListener {
    constructor(paymentRequestMessageListener, paymentMessagingDataMapper) {
        this.paymentRequestMessageListener = paymentRequestMessageListener;
        this.paymentMessagingDataMapper = paymentMessagingDataMapper;
        this.logger = new kafka_producer_1.Logger('PaymentRequestKafkaListener');
    }
    async consume(payload) {
        const { topic, partition, message } = payload;
        const key = message.key?.toString();
        const value = message.value?.toString();
        if (!value) {
            this.logger.warn('Received empty message');
            return;
        }
        try {
            const paymentRequestAvroModel = JSON.parse(value);
            this.logger.info(`Processing payment request for order id: ${paymentRequestAvroModel.orderId}, key: ${key}, partition: ${partition}`);
            if (paymentRequestAvroModel.paymentOrderStatus === common_domain_1.PaymentOrderStatus.PENDING.toString()) {
                this.logger.info(`Processing payment for order id: ${paymentRequestAvroModel.orderId}`);
                await this.paymentRequestMessageListener.completePayment(this.paymentMessagingDataMapper.paymentRequestAvroModelToPaymentRequest(paymentRequestAvroModel));
            }
            else if (paymentRequestAvroModel.paymentOrderStatus === common_domain_1.PaymentOrderStatus.CANCELLED.toString()) {
                this.logger.info(`Cancelling payment for order id: ${paymentRequestAvroModel.orderId}`);
                await this.paymentRequestMessageListener.cancelPayment(this.paymentMessagingDataMapper.paymentRequestAvroModelToPaymentRequest(paymentRequestAvroModel));
            }
        }
        catch (error) {
            if (error instanceof Error) {
                // Check for unique constraint violation (PostgreSQL error code 23505)
                if (error.message.includes('unique constraint') || error.message.includes('23505')) {
                    this.logger.error(`Caught unique constraint exception in PaymentRequestKafkaListener: ${error.message}`);
                    // NO-OP for unique constraint exception
                }
                else if (error instanceof payment_domain_core_1.PaymentNotFoundException) {
                    this.logger.error(`No payment found: ${error.message}`);
                    // NO-OP for PaymentNotFoundException
                }
                else {
                    throw new payment_application_service_1.PaymentApplicationServiceException(`Error in PaymentRequestKafkaListener: ${error.message}`, error);
                }
            }
            else {
                throw error;
            }
        }
    }
}
exports.PaymentRequestKafkaListener = PaymentRequestKafkaListener;
