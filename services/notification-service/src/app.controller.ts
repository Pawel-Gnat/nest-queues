import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@MessagePattern("send_order_notification")
	handleSendOrderNotification(@Payload() order: any) {
		this.appService.handleSendOrderNotification(order);
	}

	@MessagePattern("send_payment_notification")
	handleSendPaymentNotification(@Payload() order: any) {
		this.appService.handleSendPaymentNotification(order);
	}
}
