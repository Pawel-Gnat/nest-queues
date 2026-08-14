import { Injectable, Logger } from "@nestjs/common";
import type { Order } from "@repo/api/schemas";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	handleOrderCreate(order: Order) {
		this.logger.log(`Received order: ${JSON.stringify(order)}`);
	}
}
