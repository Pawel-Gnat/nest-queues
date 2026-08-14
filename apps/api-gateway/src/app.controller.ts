import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ORDER_SERVICE_RABBITMQ } from "./constants";

@Controller()
export class AppController {
	constructor(
		@Inject(ORDER_SERVICE_RABBITMQ) private readonly client: ClientProxy,
	) {}

	@Post("order")
	createOrder(@Body() order: any) {
		this.client.emit("order_created", order);
		return {
			message: "Order created",
			order,
		};
	}
}
