import { Injectable, Logger } from "@nestjs/common";
import type { Order, PaymentResult } from "@repo/api/schemas";
import { IdempotencyStore } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	constructor(private readonly idempotency: IdempotencyStore) {}

	async charge(order: Order): Promise<"duplicate" | "charged"> {
		const claimed = await this.idempotency.claim(
			EVENTS.payment.process,
			order.id,
			{
				ok: true,
				orderId: order.id,
			} satisfies PaymentResult,
		);

		if (!claimed) {
			this.logger.warn(
				`pid=${process.pid} duplicate charge for order ${order.id}`,
			);
			return "duplicate";
		}

		this.logger.log(
			`pid=${process.pid} charged order ${order.id}: ${JSON.stringify(order)}`,
		);
		return "charged";
	}

	async simulateSlowWork() {
		this.logger.log(
			`pid=${process.pid} working 10s (kill the process here to test retry)`,
		);
		await new Promise((resolve) => setTimeout(resolve, 10_000));
	}
}
