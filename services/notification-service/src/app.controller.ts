import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import type { Order } from "@repo/api/schemas";
import { EVENTS } from "@repo/rabbitmq";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@EventPattern(EVENTS.notification.order)
	handleSendOrderNotification(@Payload() order: Order) {
		this.appService.handleSendOrderNotification(order);
	}

	@EventPattern(EVENTS.notification.payment)
	handleSendPaymentNotification(@Payload() order: Order) {
		this.appService.handleSendPaymentNotification(order);
	}
}
