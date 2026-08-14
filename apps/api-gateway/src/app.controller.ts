import { randomUUID } from "node:crypto";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import type { Order, OrderPayload, OrderResponse } from "@repo/api/schemas";
import { EVENTS } from "@repo/rabbitmq";
import { ORDER_CLIENT } from "./constants";

@Controller()
export class AppController {
	constructor(@Inject(ORDER_CLIENT) private readonly client: ClientProxy) {}

	@Post("order")
	createOrder(@Body() payload: OrderPayload): OrderResponse {
		const order: Order = {
			id: randomUUID(),
			cartId: payload.cartId,
			userId: "anonymous",
			status: "pending",
			createdAt: new Date().toISOString(),
		};

		this.client.emit(EVENTS.order.created, order);

		return { data: order };
	}
}
