import { Controller } from "@nestjs/common";
import {
	Ctx,
	EventPattern,
	Payload,
	type RmqContext,
} from "@nestjs/microservices";
import type { Order } from "@repo/api/schemas";
import { EVENTS } from "@repo/rabbitmq";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@EventPattern(EVENTS.notification.order)
	handleSendOrderNotification(
		@Payload() order: Order,
		@Ctx() context: RmqContext,
	) {
		this.appService.handleSendOrderNotification(order);
		context.getChannelRef().ack(context.getMessage());
	}

	@EventPattern(EVENTS.notification.payment)
	handleSendPaymentNotification(
		@Payload() order: Order,
		@Ctx() context: RmqContext,
	) {
		this.appService.handleSendPaymentNotification(order);
		context.getChannelRef().ack(context.getMessage());
	}
}
