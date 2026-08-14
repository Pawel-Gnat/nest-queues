import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	handleSendOrderNotification(order: unknown) {
		this.logger.log(
			`Sending order notification for order: ${JSON.stringify(order)}`,
		);
	}

	handleSendPaymentNotification(order: unknown) {
		this.logger.log(
			`Sending payment notification for order: ${JSON.stringify(order)}`,
		);
	}
}
