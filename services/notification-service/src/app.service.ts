import { Injectable, Logger } from "@nestjs/common";
import type { Order } from "@repo/api/schemas";
import { IdempotencyStore } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	constructor(private readonly idempotency: IdempotencyStore) {}

	async handleSendOrderNotification(order: Order) {
		await this.sendOnce(EVENTS.notification.order, order, () => {
			this.logger.log(
				`Sending order notification for order: ${JSON.stringify(order)}`,
			);
		});
	}

	async handleSendPaymentNotification(order: Order) {
		await this.sendOnce(EVENTS.notification.payment, order, () => {
			this.logger.log(
				`Sending payment notification for order: ${JSON.stringify(order)}`,
			);
		});
	}

	private async sendOnce(pattern: string, order: Order, send: () => void) {
		const claimed = await this.idempotency.claim(pattern, order.id, true);
		if (!claimed) {
			this.logger.warn(`skipped duplicate ${pattern} ${order.id}`);
			return;
		}

		send();
	}
}
