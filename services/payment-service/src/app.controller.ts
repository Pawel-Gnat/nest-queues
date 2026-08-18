import { Controller, Inject } from "@nestjs/common";
import {
	ClientProxy,
	Ctx,
	EventPattern,
	Payload,
	type RmqContext,
} from "@nestjs/microservices";
import type { Order } from "@repo/api/schemas";
import { NOTIFICATION_PUBLISHER, settleRmqMessage } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		@Inject(NOTIFICATION_PUBLISHER)
		private readonly notifications: ClientProxy,
	) {}

	@EventPattern(EVENTS.order.created)
	handleOrderCreated(@Payload() order: Order, @Ctx() context: RmqContext) {
		return settleRmqMessage(context, async () => {
			await this.appService.charge(order);
			this.notifications.emit(EVENTS.notification.payment, order);
		});
	}
}
