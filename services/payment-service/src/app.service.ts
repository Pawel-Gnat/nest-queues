import { Injectable, Logger } from "@nestjs/common";
import type { Order } from "@repo/api/schemas";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	handleProcessPayment(order: Order) {
		this.logger.log(`Processing payment for order: ${JSON.stringify(order)}`);
	}
}
