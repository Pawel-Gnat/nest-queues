import { Module } from "@nestjs/common";
import {
	IdempotencyModule,
	NOTIFICATION_CLIENT,
	PAYMENT_CLIENT,
	registerRmqClients,
} from "@repo/nestjs";
import { QUEUES } from "@repo/rabbitmq";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
	imports: [
		IdempotencyModule,
		registerRmqClients([
			{ name: PAYMENT_CLIENT, queue: QUEUES.payment },
			{ name: NOTIFICATION_CLIENT, queue: QUEUES.notification },
		]),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
