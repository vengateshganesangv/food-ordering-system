import { Repository } from 'typeorm';
import { PaymentEntity } from '../entity/PaymentEntity';
export declare class PaymentJpaRepository extends Repository<PaymentEntity> {
    findByOrderId(orderId: string): Promise<PaymentEntity | null>;
}
