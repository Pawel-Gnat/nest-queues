import { Injectable, Logger } from "@nestjs/common";
import type { Order } from "@repo/api/schemas";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	handleProcessPayment(order: Order) {
		this.logger.log(
			`pid=${process.pid} processing payment for order: ${JSON.stringify(order)}`,
		);
	}

	async simulateSlowWork() {
		this.logger.log(`pid=${process.pid} working 3s (prefetch demo)`);
		await new Promise((resolve) => setTimeout(resolve, 3000));
	}
}
