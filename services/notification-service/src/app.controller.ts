import { Controller, UseInterceptors } from "@nestjs/common";
import {
	Ctx,
	EventPattern,
	Payload,
	type RmqContext,
} from "@nestjs/microservices";
import type { Order } from "@repo/api/schemas";
import { IdempotencyInterceptor, settleRmqMessage } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";
import { AppService } from "./app.service";

@Controller()
@UseInterceptors(IdempotencyInterceptor)
export class AppController {
	constructor(private readonly appService: AppService) {}

	@EventPattern(EVENTS.notification.order)
	handleSendOrderNotification(
		@Payload() order: Order,
		@Ctx() context: RmqContext,
	) {
		return settleRmqMessage(context, () => {
			this.appService.handleSendOrderNotification(order);
		});
	}

	@EventPattern(EVENTS.notification.payment)
	handleSendPaymentNotification(
		@Payload() order: Order,
		@Ctx() context: RmqContext,
	) {
		return settleRmqMessage(context, () => {
			this.appService.handleSendPaymentNotification(order);
		});
	}
}
