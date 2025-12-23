import { PaymentRequestMessageListener } from './ports/input/message/listener/PaymentRequestMessageListener';
import { PaymentRequest } from './dto/PaymentRequest';
import { PaymentRequestHelper } from './PaymentRequestHelper';
export declare class PaymentRequestMessageListenerImpl implements PaymentRequestMessageListener {
    private readonly paymentRequestHelper;
    constructor(paymentRequestHelper: PaymentRequestHelper);
    completePayment(paymentRequest: PaymentRequest): Promise<void>;
    cancelPayment(paymentRequest: PaymentRequest): Promise<void>;
}
