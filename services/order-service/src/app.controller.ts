import { Controller } from "@nestjs/common";
import {
	Ctx,
	EventPattern,
	Payload,
	type RmqContext,
} from "@nestjs/microservices";
import type { Order } from "@repo/api/schemas";
import { settleRmqMessage } from "@repo/nestjs";
import { EVENTS, publishTopic, ROUTING_KEYS } from "@repo/rabbitmq";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@EventPattern(EVENTS.order.created)
	handleOrderCreate(@Payload() order: Order, @Ctx() context: RmqContext) {
		return settleRmqMessage(context, async () => {
			this.appService.handleOrderCreate(order);
			await publishTopic(
				ROUTING_KEYS.orderCreated,
				EVENTS.order.created,
				order,
			);
			await publishTopic(
				ROUTING_KEYS.paymentProcess,
				EVENTS.payment.process,
				order,
			);
		});
	}
}
