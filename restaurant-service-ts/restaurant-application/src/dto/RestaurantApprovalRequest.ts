import { RestaurantOrderStatus } from '@food-ordering-system/common-domain';
import { Product } from '../../../restaurant-domain-core/src/entity/Product';

/**
 * Restaurant Approval Request DTO
 * Contains order details for restaurant validation
 */
export interface RestaurantApprovalRequest {
  id: string;
  sagaId: string;
  restaurantId: string;
  orderId: string;
  restaurantOrderStatus: RestaurantOrderStatus;
  products: Product[];
  price: number;
  createdAt: Date;
}

/**
 * Builder for RestaurantApprovalRequest
 */
export class RestaurantApprovalRequestBuilder {
  private _id?: string;
  private _sagaId?: string;
  private _restaurantId?: string;
  private _orderId?: string;
  private _restaurantOrderStatus?: RestaurantOrderStatus;
  private _products?: Product[];
  private _price?: number;
  private _createdAt?: Date;

  id(value: string): this {
    this._id = value;
    return this;
  }

  sagaId(value: string): this {
    this._sagaId = value;
    return this;
  }

  restaurantId(value: string): this {
    this._restaurantId = value;
    return this;
  }

  orderId(value: string): this {
    this._orderId = value;
    return this;
  }

  restaurantOrderStatus(value: RestaurantOrderStatus): this {
    this._restaurantOrderStatus = value;
    return this;
  }

  products(value: Product[]): this {
    this._products = value;
    return this;
  }

  price(value: number): this {
    this._price = value;
    return this;
  }

  createdAt(value: Date): this {
    this._createdAt = value;
    return this;
  }

  build(): RestaurantApprovalRequest {
    if (!this._id || !this._sagaId || !this._restaurantId || !this._orderId ||
        !this._restaurantOrderStatus || !this._products || this._price === undefined || !this._createdAt) {
      throw new Error('Missing required fields for RestaurantApprovalRequest');
    }

    return {
      id: this._id,
      sagaId: this._sagaId,
      restaurantId: this._restaurantId,
      orderId: this._orderId,
      restaurantOrderStatus: this._restaurantOrderStatus,
      products: this._products,
      price: this._price,
      createdAt: this._createdAt,
    };
  }
}
