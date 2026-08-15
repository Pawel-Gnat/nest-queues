import { Controller, Inject } from "@nestjs/common";
import { ClientProxy, EventPattern, Payload } from "@nestjs/microservices";
import type { Order, PaymentResult } from "@repo/api/schemas";
import { NOTIFICATION_CLIENT, PAYMENT_CLIENT } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";
import { firstValueFrom, TimeoutError, timeout } from "rxjs";
import { AppService } from "./app.service";

const PAYMENT_RPC_TIMEOUT_MS = 5000;

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		@Inject(PAYMENT_CLIENT) private readonly paymentClient: ClientProxy,
		@Inject(NOTIFICATION_CLIENT)
		private readonly notificationClient: ClientProxy,
	) {}

	@EventPattern(EVENTS.order.created)
	async handleOrderCreate(@Payload() order: Order) {
		this.appService.handleOrderCreate(order);

		this.notificationClient.emit(EVENTS.notification.order, order);

		try {
			const result = await firstValueFrom(
				this.paymentClient
					.send<PaymentResult>(EVENTS.payment.process, order)
					.pipe(timeout(PAYMENT_RPC_TIMEOUT_MS)),
			);
			this.appService.handlePaymentResult(result);
		} catch (error: unknown) {
			this.appService.handlePaymentRpcError(
				order,
				error instanceof TimeoutError
					? `timeout after ${PAYMENT_RPC_TIMEOUT_MS}ms`
					: String(error),
			);
		}
	}
}
