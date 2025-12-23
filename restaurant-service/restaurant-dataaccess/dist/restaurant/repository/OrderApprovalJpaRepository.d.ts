import { Repository } from 'typeorm';
import { OrderApprovalEntity } from '../entity/OrderApprovalEntity';
/**
 * Order Approval JPA Repository
 * TypeORM repository for OrderApprovalEntity
 * Uses TypeORM's Repository<T> which provides save, find, findOne, delete, etc.
 */
export type OrderApprovalJpaRepository = Repository<OrderApprovalEntity>;
