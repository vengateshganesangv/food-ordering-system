import { OrderApprovalStatus } from '@food-ordering-system/common-domain';

/**
 * Restaurant Approval Response DTO
 * Represents restaurant approval response message from restaurant service
 */
export class RestaurantApprovalResponse {
  constructor(
    private readonly id: string,
    private readonly sagaId: string,
    private readonly orderId: string,
    private readonly restaurantId: string,
    private readonly createdAt: Date,
    private readonly orderApprovalStatus: OrderApprovalStatus,
    private readonly failureMessages: string[],
  ) {}

  getId(): string {
    return this.id;
  }

  getSagaId(): string {
    return this.sagaId;
  }

  getOrderId(): string {
    return this.orderId;
  }

  getRestaurantId(): string {
    return this.restaurantId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getOrderApprovalStatus(): OrderApprovalStatus {
    return this.orderApprovalStatus;
  }

  getFailureMessages(): string[] {
    return this.failureMessages;
  }

  static builder(): RestaurantApprovalResponseBuilder {
    return new RestaurantApprovalResponseBuilder();
  }

  static Builder = class RestaurantApprovalResponseBuilder {
    public _id?: string;
    public _sagaId?: string;
    public _orderId?: string;
    public _restaurantId?: string;
    public _createdAt?: Date;
    public _orderApprovalStatus?: OrderApprovalStatus;
    public _failureMessages?: string[];

    id(val: string): this {
      this._id = val;
      return this;
    }

    sagaId(val: string): this {
      this._sagaId = val;
      return this;
    }

    orderId(val: string): this {
      this._orderId = val;
      return this;
    }

    restaurantId(val: string): this {
      this._restaurantId = val;
      return this;
    }

    createdAt(val: Date): this {
      this._createdAt = val;
      return this;
    }

    orderApprovalStatus(val: OrderApprovalStatus): this {
      this._orderApprovalStatus = val;
      return this;
    }

    failureMessages(val: string[]): this {
      this._failureMessages = val;
      return this;
    }

    build(): RestaurantApprovalResponse {
      if (
        !this._id ||
        !this._sagaId ||
        !this._orderId ||
        !this._restaurantId ||
        !this._createdAt ||
        !this._orderApprovalStatus ||
        !this._failureMessages
      ) {
        throw new Error('Missing required fields for RestaurantApprovalResponse');
      }
      return new RestaurantApprovalResponse(
        this._id,
        this._sagaId,
        this._orderId,
        this._restaurantId,
        this._createdAt,
        this._orderApprovalStatus,
        this._failureMessages,
      );
    }
  };
}
