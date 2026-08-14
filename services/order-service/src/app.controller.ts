import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import type { Order } from "@repo/api/schemas";
import { EVENTS } from "@repo/rabbitmq";
import { AppService } from "./app.service";
import { NOTIFICATION_CLIENT, PAYMENT_CLIENT } from "./constants";

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		@Inject(PAYMENT_CLIENT) private readonly paymentClient: ClientProxy,
		@Inject(NOTIFICATION_CLIENT)
		private readonly notificationClient: ClientProxy,
	) {}

	@MessagePattern(EVENTS.order.created)
	handleOrderCreate(@Payload() order: Order) {
		this.appService.handleOrderCreate(order);

		this.paymentClient.emit(EVENTS.payment.process, order);
		this.notificationClient.emit(EVENTS.notification.order, order);
	}
}
