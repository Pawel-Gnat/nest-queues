import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import type { Order } from "@repo/api/schemas";
import { NOTIFICATION_CLIENT } from "@repo/nestjs";
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
	handleProcessPayment(@Payload() order: Order) {
		this.appService.handleProcessPayment(order);

		this.notificationClient.emit(EVENTS.notification.payment, order);
	}
}
