import { OrderId } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import { RestaurantApprovalRequest } from './dto/RestaurantApprovalRequest';
import { Restaurant } from '@food-ordering-system/restaurant-domain-core';
// import { OrderApprovalEvent } from '@food-ordering-system/restaurant-domain-core';
import { RestaurantNotFoundException } from '@food-ordering-system/restaurant-domain-core';
import { RestaurantDataMapper } from './mapper/RestaurantDataMapper';
import { OrderOutboxHelper } from './outbox/scheduler/OrderOutboxHelper';
import { RestaurantApprovalResponseMessagePublisher } from './ports/output/message/publisher/RestaurantApprovalResponseMessagePublisher';
import { OrderApprovalRepository } from './ports/output/repository/OrderApprovalRepository';
import { RestaurantRepository } from './ports/output/repository/RestaurantRepository';
import { RestaurantDomainService } from '@food-ordering-system/restaurant-domain-core';
import { Logger } from '@food-ordering-system/kafka-producer';

/**
 * Restaurant Approval Request Helper
 * Handles the business logic for restaurant approval requests
 */
export class RestaurantApprovalRequestHelper {
  private readonly logger: Logger;

  constructor(
    private readonly restaurantDomainService: RestaurantDomainService,
    private readonly restaurantDataMapper: RestaurantDataMapper,
    private readonly restaurantRepository: RestaurantRepository,
    private readonly orderApprovalRepository: OrderApprovalRepository,
    private readonly orderOutboxHelper: OrderOutboxHelper,
    private readonly restaurantApprovalResponseMessagePublisher: RestaurantApprovalResponseMessagePublisher,
    logger?: Logger,
  ) {
    this.logger = logger || new Logger('RestaurantApprovalRequestHelper');
  }

  /**
   * Persist order approval with transaction management
   * Implements idempotency check via outbox pattern
   */
  async persistOrderApproval(restaurantApprovalRequest: RestaurantApprovalRequest): Promise<void> {
    // Check if message already processed (idempotency)
    if (await this.publishIfOutboxMessageProcessed(restaurantApprovalRequest)) {
      this.logger.info(
        `An outbox message with saga id: ${restaurantApprovalRequest.sagaId} already saved to database!`,
      );
      return;
    }

    this.logger.info(`Processing restaurant approval for order id: ${restaurantApprovalRequest.orderId}`);

    const failureMessages: string[] = [];
    const restaurant = await this.findRestaurant(restaurantApprovalRequest);

    // Validate order using domain service
    const orderApprovalEvent = this.restaurantDomainService.validateOrder(
      restaurant,
      failureMessages,
    );

    // Save order approval
    await this.orderApprovalRepository.save(restaurant.getOrderApproval()!);

    // Save outbox message for reliable messaging
    await this.orderOutboxHelper.saveOrderOutboxMessage(
      this.restaurantDataMapper.orderApprovalEventToOrderEventPayload(orderApprovalEvent),
      orderApprovalEvent.getOrderApproval().getApprovalStatus(),
      OutboxStatus.STARTED,
      restaurantApprovalRequest.sagaId,
    );
  }

  /**
   * Find restaurant information and enrich with product details
   */
  private async findRestaurant(
    restaurantApprovalRequest: RestaurantApprovalRequest,
  ): Promise<Restaurant> {
    const restaurant = this.restaurantDataMapper.restaurantApprovalRequestToRestaurant(
      restaurantApprovalRequest,
    );

    const restaurantResult = await this.restaurantRepository.findRestaurantInformation(restaurant);

    if (!restaurantResult) {
      const restaurantId = restaurant.getId()!.getValue();
      this.logger.error(`Restaurant with id ${restaurantId} not found!`);
      throw new RestaurantNotFoundException(`Restaurant with id ${restaurantId} not found!`);
    }

    const restaurantEntity = restaurantResult;
    restaurant.setActive(restaurantEntity.isActive());

    // Match and update product information
    restaurant.getOrderDetail()!.getProducts().forEach((product) => {
      restaurantEntity.getOrderDetail()!.getProducts().forEach((p) => {
        if (p.getId()!.equals(product.getId()!)) {
          product.updateWithConfirmedNamePriceAndAvailability(
            p.getName()!,
            p.getPrice()!,
            p.isAvailable(),
          );
        }
      });
    });

    restaurant.getOrderDetail().setId(new OrderId(restaurantApprovalRequest.orderId));

    return restaurant;
  }

  /**
   * Check if message already processed and publish if it was
   * Implements idempotency check
   */
  private async publishIfOutboxMessageProcessed(
    restaurantApprovalRequest: RestaurantApprovalRequest,
  ): Promise<boolean> {
    const orderOutboxMessage =
      await this.orderOutboxHelper.getCompletedOrderOutboxMessageBySagaIdAndOutboxStatus(
        restaurantApprovalRequest.sagaId,
        OutboxStatus.COMPLETED,
      );

    if (orderOutboxMessage) {
      await this.restaurantApprovalResponseMessagePublisher.publish(
        orderOutboxMessage,
        this.orderOutboxHelper.updateOutboxStatus.bind(this.orderOutboxHelper),
      );
      return true;
    }

    return false;
  }
}
