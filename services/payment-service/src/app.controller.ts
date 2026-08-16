import { Controller, Inject } from "@nestjs/common";
import {
	ClientProxy,
	Ctx,
	MessagePattern,
	Payload,
	type RmqContext,
} from "@nestjs/microservices";
import type { Order, PaymentResult } from "@repo/api/schemas";
import { NOTIFICATION_CLIENT, settleRmqMessage } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";
import { AppService } from "./app.service";

/** POST /api/order with this cartId to send the message to payment_dlq. */
export const REQUEUE_DEMO_CART_ID = "fail-requeue";

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		@Inject(NOTIFICATION_CLIENT)
		private readonly notificationClient: ClientProxy,
	) {}

	@MessagePattern(EVENTS.payment.process)
	handleProcessPayment(
		@Payload() order: Order,
		@Ctx() context: RmqContext,
	): Promise<PaymentResult> {
		return settleRmqMessage(context, async () => {
			this.appService.handleProcessPayment(order);

			if (order.cartId === REQUEUE_DEMO_CART_ID) {
				throw new Error(`Payment failed for cart ${order.cartId}`);
			}

			await this.appService.simulateSlowWork();
			this.notificationClient.emit(EVENTS.notification.payment, order);

			return { ok: true, orderId: order.id };
		});
	}
}
