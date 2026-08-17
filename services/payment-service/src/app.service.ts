import { Injectable, Logger } from "@nestjs/common";
import type { Order } from "@repo/api/schemas";
import { IdempotencyStore } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";

/** POST /api/order with this cartId to send payment to DLQ after 3 throws. */
export const DLQ_DEMO_CART_ID = "dlq";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	constructor(private readonly idempotency: IdempotencyStore) {}

	async charge(order: Order): Promise<"duplicate" | "charged"> {
		if (order.cartId === DLQ_DEMO_CART_ID) {
			this.logger.error(
				`pid=${process.pid} demo DLQ — throwing for cart ${order.cartId}`,
			);
			throw new Error(`demo DLQ for cart ${order.cartId}`);
		}

		const claimed = await this.idempotency.claim(
			EVENTS.payment.process,
			order.id,
			true,
		);

		if (!claimed) {
			this.logger.warn(
				`pid=${process.pid} duplicate charge for order ${order.id}`,
			);
			return "duplicate";
		}

		this.logger.log(
			`pid=${process.pid} charging order ${order.id} (kill the process here to test retry)`,
		);
		await new Promise((resolve) => setTimeout(resolve, 10_000));

		this.logger.log(
			`pid=${process.pid} charged order ${order.id}: ${JSON.stringify(order)}`,
		);
		return "charged";
	}
}
