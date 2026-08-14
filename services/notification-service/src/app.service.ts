import { Injectable, Logger } from "@nestjs/common";
import type { Order } from "@repo/api/schemas";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	handleSendOrderNotification(order: Order) {
		this.logger.log(
			`Sending order notification for order: ${JSON.stringify(order)}`,
		);
	}

	handleSendPaymentNotification(order: Order) {
		this.logger.log(
			`Sending payment notification for order: ${JSON.stringify(order)}`,
		);
	}
}
