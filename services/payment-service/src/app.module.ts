import { Module } from "@nestjs/common";
import {
	IdempotencyModule,
	NOTIFICATION_PUBLISHER,
	registerRmqPublishers,
} from "@repo/nestjs";
import { QUEUES } from "@repo/rabbitmq";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
	imports: [
		IdempotencyModule,
		registerRmqPublishers([
			{ name: NOTIFICATION_PUBLISHER, queue: QUEUES.notification },
		]),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
