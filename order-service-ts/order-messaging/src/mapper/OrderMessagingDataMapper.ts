import { v4 as uuidv4 } from 'uuid';
import { PaymentStatus, OrderApprovalStatus } from '@food-ordering-system/common-domain';
import {
  CustomerModel,
  PaymentResponse,
  RestaurantApprovalResponse,
  OrderPaymentEventPayload,
  OrderApprovalEventPayload,
} from '@food-ordering-system/order-application-service';
import {
  PaymentResponseAvroModel,
  RestaurantApprovalResponseAvroModel,
  PaymentRequestAvroModel,
  RestaurantApprovalRequestAvroModel,
  CustomerAvroModel,
  PaymentOrderStatus,
  RestaurantOrderStatus,
  Product,
} from '@food-ordering-system/kafka-model';

export class OrderMessagingDataMapper {
  paymentResponseAvroModelToPaymentResponse(
    paymentResponseAvroModel: PaymentResponseAvroModel,
  ): PaymentResponse {
    return PaymentResponse.builder()
      .id(paymentResponseAvroModel.id)
      .sagaId(paymentResponseAvroModel.sagaId)
      .paymentId(paymentResponseAvroModel.paymentId)
      .customerId(paymentResponseAvroModel.customerId)
      .orderId(paymentResponseAvroModel.orderId)
      .price(paymentResponseAvroModel.price)
      .createdAt(new Date(paymentResponseAvroModel.createdAt))
      .paymentStatus(PaymentStatus[paymentResponseAvroModel.paymentStatus as keyof typeof PaymentStatus])
      .failureMessages(paymentResponseAvroModel.failureMessages)
      .build();
  }

  approvalResponseAvroModelToApprovalResponse(
    restaurantApprovalResponseAvroModel: RestaurantApprovalResponseAvroModel,
  ): RestaurantApprovalResponse {
    return RestaurantApprovalResponse.builder()
      .id(restaurantApprovalResponseAvroModel.id)
      .sagaId(restaurantApprovalResponseAvroModel.sagaId)
      .restaurantId(restaurantApprovalResponseAvroModel.restaurantId)
      .orderId(restaurantApprovalResponseAvroModel.orderId)
      .createdAt(new Date(restaurantApprovalResponseAvroModel.createdAt))
      .orderApprovalStatus(
        OrderApprovalStatus[
          restaurantApprovalResponseAvroModel.orderApprovalStatus as keyof typeof OrderApprovalStatus
        ],
      )
      .failureMessages(restaurantApprovalResponseAvroModel.failureMessages)
      .build();
  }

  orderPaymentEventToPaymentRequestAvroModel(
    sagaId: string,
    orderPaymentEventPayload: OrderPaymentEventPayload,
  ): PaymentRequestAvroModel {
    return {
      id: uuidv4(),
      sagaId,
      customerId: orderPaymentEventPayload.getCustomerId(),
      orderId: orderPaymentEventPayload.getOrderId(),
      price: orderPaymentEventPayload.getPrice(),
      createdAt: orderPaymentEventPayload.getCreatedAt().toISOString(),
      paymentOrderStatus: orderPaymentEventPayload.getPaymentOrderStatus() as PaymentOrderStatus,
    };
  }

  orderApprovalEventToRestaurantApprovalRequestAvroModel(
    sagaId: string,
    orderApprovalEventPayload: OrderApprovalEventPayload,
  ): RestaurantApprovalRequestAvroModel {
    return {
      id: uuidv4(),
      sagaId,
      orderId: orderApprovalEventPayload.getOrderId(),
      restaurantId: orderApprovalEventPayload.getRestaurantId(),
      restaurantOrderStatus: orderApprovalEventPayload.getRestaurantOrderStatus() as RestaurantOrderStatus,
      products: orderApprovalEventPayload.getProducts().map((product) => ({
        id: product.getId(),
        quantity: product.getQuantity(),
      })) as Product[],
      price: orderApprovalEventPayload.getPrice(),
      createdAt: orderApprovalEventPayload.getCreatedAt().toISOString(),
    };
  }

  customerAvroModeltoCustomerModel(customerAvroModel: CustomerAvroModel): CustomerModel {
    return CustomerModel.builder()
      .id(customerAvroModel.id)
      .username(customerAvroModel.username)
      .firstName(customerAvroModel.firstName)
      .lastName(customerAvroModel.lastName)
      .build();
  }
}
