import { OrderApprovalStatus } from '@food-ordering-system/common-domain';

/**
 * Order Event Payload
 * Contains the payload data for outbox messages
 */
export interface OrderEventPayload {
  orderId: string;
  restaurantId: string;
  createdAt: Date;
  orderApprovalStatus: OrderApprovalStatus;
  failureMessages: string[];
}

/**
 * Builder for OrderEventPayload
 */
export class OrderEventPayloadBuilder {
  private _orderId?: string;
  private _restaurantId?: string;
  private _createdAt?: Date;
  private _orderApprovalStatus?: OrderApprovalStatus;
  private _failureMessages: string[] = [];

  orderId(value: string): this {
    this._orderId = value;
    return this;
  }

  restaurantId(value: string): this {
    this._restaurantId = value;
    return this;
  }

  createdAt(value: Date): this {
    this._createdAt = value;
    return this;
  }

  orderApprovalStatus(value: OrderApprovalStatus): this {
    this._orderApprovalStatus = value;
    return this;
  }

  failureMessages(value: string[]): this {
    this._failureMessages = value;
    return this;
  }

  build(): OrderEventPayload {
    if (!this._orderId || !this._restaurantId || !this._createdAt || !this._orderApprovalStatus) {
      throw new Error('Missing required fields for OrderEventPayload');
    }

    return {
      orderId: this._orderId,
      restaurantId: this._restaurantId,
      createdAt: this._createdAt,
      orderApprovalStatus: this._orderApprovalStatus,
      failureMessages: this._failureMessages,
    };
  }
}
