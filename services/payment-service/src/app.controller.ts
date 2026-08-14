import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";
import { NOTIFICATION_CLIENT } from "./constants";

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		@Inject(NOTIFICATION_CLIENT)
		private readonly notificationClient: ClientProxy,
	) {}

	@MessagePattern("process_payment")
	handleProcessPayment(@Payload() order: any) {
		this.appService.handleProcessPayment(order);

		this.notificationClient.emit("send_payment_notification", {
			orderId: order.id,
		});
	}
}
