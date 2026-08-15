import { Controller, Inject } from "@nestjs/common";
import {
	ClientProxy,
	Ctx,
	MessagePattern,
	Payload,
	type RmqContext,
} from "@nestjs/microservices";
import type { Order, PaymentResult } from "@repo/api/schemas";
import { NOTIFICATION_CLIENT } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";
import { AppService } from "./app.service";

/** POST /api/order with this cartId to see nack + requeue loop. */
export const REQUEUE_DEMO_CART_ID = "fail-requeue";

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		@Inject(NOTIFICATION_CLIENT)
		private readonly notificationClient: ClientProxy,
	) {}

	@MessagePattern(EVENTS.payment.process)
	async handleProcessPayment(
		@Payload() order: Order,
		@Ctx() context: RmqContext,
	): Promise<PaymentResult> {
		this.appService.handleProcessPayment(order);

		const channel = context.getChannelRef();
		const message = context.getMessage();

		if (order.cartId === REQUEUE_DEMO_CART_ID) {
			channel.nack(message, false, true);
			throw new Error(`Forced requeue for cart ${order.cartId}`);
		}

		await this.appService.simulateSlowWork();

		this.notificationClient.emit(EVENTS.notification.payment, order);
		channel.ack(message);

		return { ok: true, orderId: order.id };
	}
}
