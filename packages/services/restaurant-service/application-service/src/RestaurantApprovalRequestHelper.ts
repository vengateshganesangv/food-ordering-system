import { injectable, inject } from 'tsyringe';
import { OrderApprovalStatus } from '@food-ordering-system/common-domain';
import { OutboxStatus } from '@food-ordering-system/outbox';
import {
  RestaurantDomainService,
  Restaurant,
  OrderApprovalEvent,
  RestaurantNotFoundException,
} from '@food-ordering-system/restaurant-domain-core';
import { RestaurantApprovalRequest } from './dto/RestaurantApprovalRequest';
import { RestaurantDataMapper } from './mapper/RestaurantDataMapper';
import { RestaurantRepository } from './ports/output/repository/RestaurantRepository';
import { OrderApprovalRepository } from './ports/output/repository/OrderApprovalRepository';
import { OrderOutboxHelper } from './outbox/OrderOutboxHelper';
import { RestaurantApprovalResponseMessagePublisher } from './ports/output/message/RestaurantApprovalResponseMessagePublisher';
import { RestaurantApplicationServiceException } from './exception/RestaurantApplicationServiceException';

@injectable()
export class RestaurantApprovalRequestHelper {
  constructor(
    @inject('RestaurantDomainService')
    private readonly restaurantDomainService: RestaurantDomainService,
    private readonly restaurantDataMapper: RestaurantDataMapper,
    @inject('RestaurantRepository')
    private readonly restaurantRepository: RestaurantRepository,
    @inject('OrderApprovalRepository')
    private readonly orderApprovalRepository: OrderApprovalRepository,
    private readonly orderOutboxHelper: OrderOutboxHelper,
    @inject('RestaurantApprovalResponseMessagePublisher')
    private readonly restaurantApprovalResponseMessagePublisher: RestaurantApprovalResponseMessagePublisher
  ) {}

  async persistOrderApproval(restaurantApprovalRequest: RestaurantApprovalRequest): Promise<void> {
    console.log(`Processing restaurant approval for order id: ${restaurantApprovalRequest.orderId}`);
    const failureMessages: string[] = [];
    const restaurant = this.restaurantDataMapper.restaurantApprovalRequestToRestaurant(restaurantApprovalRequest);

    const restaurantInformation = await this.restaurantRepository.findRestaurantInformation(restaurant);
    if (!restaurantInformation) {
      console.error(`Restaurant with id: ${restaurantApprovalRequest.restaurantId} not found`);
      throw new RestaurantNotFoundException(
        `Restaurant with id: ${restaurantApprovalRequest.restaurantId} not found`
      );
    }

    const orderApprovalEvent = this.restaurantDomainService.validateOrder(restaurantInformation, failureMessages);

    await this.orderApprovalRepository.save(restaurantInformation.orderApproval!);

    await this.orderOutboxHelper.saveOrderOutboxMessage(
      this.restaurantDataMapper.orderApprovalEventToOrderEventPayload(orderApprovalEvent),
      orderApprovalEvent.orderApproval.approvalStatus,
      OutboxStatus.STARTED,
      restaurantApprovalRequest.sagaId
    );
  }
}
