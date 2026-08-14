import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
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

	@MessagePattern("order_created")
	handleOrderCreate(@Payload() order: any) {
		this.appService.handleOrderCreate(order);

		this.paymentClient.emit("process_payment", { orderId: order.id });
		this.notificationClient.emit("send_order_notification", {
			orderId: order.id,
		});
	}
}
