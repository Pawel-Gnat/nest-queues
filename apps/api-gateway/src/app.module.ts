import { Module } from "@nestjs/common";
import { ORDER_PUBLISHER, registerRmqPublishers } from "@repo/nestjs";
import { QUEUES } from "@repo/rabbitmq";
import { AppController } from "./app.controller";

@Module({
	imports: [
		registerRmqPublishers([{ name: ORDER_PUBLISHER, queue: QUEUES.order }]),
	],
	controllers: [AppController],
})
export class AppModule {}
