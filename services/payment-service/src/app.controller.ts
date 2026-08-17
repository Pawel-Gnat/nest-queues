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
			await this.appService.charge(order);
			this.notificationClient.emit(EVENTS.notification.payment, order);

			return { ok: true, orderId: order.id };
		});
	}
}
