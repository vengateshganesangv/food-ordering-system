import { RestaurantOrderStatus } from '@food-ordering-system/common-domain';
import { Product } from '@food-ordering-system/restaurant-domain-core';

export class RestaurantApprovalRequest {
  id!: string;
  sagaId!: string;
  restaurantId!: string;
  orderId!: string;
  restaurantOrderStatus!: RestaurantOrderStatus;
  products!: Product[];
  price!: number;
  createdAt!: Date;

  constructor(partial?: Partial<RestaurantApprovalRequest>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
