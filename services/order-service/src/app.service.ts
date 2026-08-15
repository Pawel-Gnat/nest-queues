import { Injectable, Logger } from "@nestjs/common";
import type { Order, PaymentResult } from "@repo/api/schemas";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	handleOrderCreate(order: Order) {
		this.logger.log(`Received order: ${JSON.stringify(order)}`);
	}

	handlePaymentResult(result: PaymentResult) {
		this.logger.log(`Payment RPC result: ${JSON.stringify(result)}`);
	}

	handlePaymentRpcError(order: Order, reason: string) {
		this.logger.error(`Payment RPC failed for order ${order.id}: ${reason}`);
	}
}
