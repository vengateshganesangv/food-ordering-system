import { injectable } from 'tsyringe';
import { RestaurantOrderStatus, ProductId, Money } from '@food-ordering-system/common-domain';
import { Product } from '@food-ordering-system/restaurant-domain-core';
import { RestaurantApprovalRequest, OrderEventPayload } from '@food-ordering-system/restaurant-application-service';

export interface RestaurantApprovalRequestAvroModel {
  id: string;
  sagaId: string;
  restaurantId: string;
  orderId: string;
  restaurantOrderStatus: string;
  products: Array<{
    id: string;
    quantity: number;
  }>;
  price: number;
  createdAt: number;
}

export interface RestaurantApprovalResponseAvroModel {
  id: string;
  sagaId: string;
  restaurantId: string;
  orderId: string;
  orderApprovalStatus: string;
  failureMessages: string[];
  createdAt: number;
}

@injectable()
export class RestaurantMessagingDataMapper {
  restaurantApprovalRequestAvroModelToRestaurantApproval(
    avroModel: RestaurantApprovalRequestAvroModel
  ): RestaurantApprovalRequest {
    return new RestaurantApprovalRequest({
      id: avroModel.id,
      sagaId: avroModel.sagaId,
      restaurantId: avroModel.restaurantId,
      orderId: avroModel.orderId,
      restaurantOrderStatus: this.stringToRestaurantOrderStatus(avroModel.restaurantOrderStatus),
      products: avroModel.products.map((p) =>
        Product.builder()
          .setProductId(new ProductId(p.id))
          .setQuantity(p.quantity)
          .build()
      ),
      price: avroModel.price,
      createdAt: new Date(avroModel.createdAt),
    });
  }

  orderEventPayloadToRestaurantApprovalResponseAvroModel(
    sagaId: string,
    orderEventPayload: OrderEventPayload
  ): RestaurantApprovalResponseAvroModel {
    return {
      id: orderEventPayload.orderId,
      sagaId,
      restaurantId: orderEventPayload.restaurantId,
      orderId: orderEventPayload.orderId,
      orderApprovalStatus: orderEventPayload.orderApprovalStatus,
      failureMessages: orderEventPayload.failureMessages,
      createdAt: orderEventPayload.createdAt.getTime(),
    };
  }

  private stringToRestaurantOrderStatus(status: string): RestaurantOrderStatus {
    switch (status) {
      case 'PAID':
        return RestaurantOrderStatus.PAID;
      default:
        throw new Error(`Unknown RestaurantOrderStatus: ${status}`);
    }
  }
}
