"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentEventKafkaPublisher = void 0;
const kafka_producer_1 = require("@food-ordering-system/kafka-producer");
const payment_application_service_1 = require("@food-ordering-system/payment-application-service");
class PaymentEventKafkaPublisher {
    constructor(paymentMessagingDataMapper, kafkaProducer, paymentServiceConfigData, kafkaMessageHelper) {
        this.paymentMessagingDataMapper = paymentMessagingDataMapper;
        this.kafkaProducer = kafkaProducer;
        this.paymentServiceConfigData = paymentServiceConfigData;
        this.kafkaMessageHelper = kafkaMessageHelper;
        this.logger = new kafka_producer_1.Logger('PaymentEventKafkaPublisher');
    }
    publish(orderOutboxMessage, outboxCallback) {
        const orderEventPayload = this.kafkaMessageHelper.getOrderEventPayload(orderOutboxMessage.payload, payment_application_service_1.OrderEventPayload);
        const sagaId = orderOutboxMessage.sagaId;
        this.logger.info(`Received OrderOutboxMessage for order id: ${orderEventPayload.orderId} and saga id: ${sagaId}`);
        try {
            const paymentResponseAvroModel = this.paymentMessagingDataMapper.orderEventPayloadToPaymentResponseAvroModel(sagaId, orderEventPayload);
            this.kafkaProducer.send(this.paymentServiceConfigData.paymentResponseTopicName, sagaId, paymentResponseAvroModel, this.kafkaMessageHelper.getKafkaCallback(this.paymentServiceConfigData.paymentResponseTopicName, paymentResponseAvroModel, orderOutboxMessage, outboxCallback, orderEventPayload.orderId, 'PaymentResponseAvroModel'));
            this.logger.info(`PaymentResponseAvroModel sent to kafka for order id: ${paymentResponseAvroModel.orderId} and saga id: ${sagaId}`);
        }
        catch (error) {
            this.logger.error(`Error while sending PaymentResponseAvroModel message to kafka with order id: ${orderEventPayload.orderId} and saga id: ${sagaId}, error: ${error}`);
        }
    }
}
exports.PaymentEventKafkaPublisher = PaymentEventKafkaPublisher;
