import { Module } from "@nestjs/common";
import { PROJECT_PUBLISHER, registerRmqPublishers } from "@repo/nestjs";
import { QUEUES } from "@repo/rabbitmq";
import { AppController } from "./app.controller";

@Module({
	imports: [
		registerRmqPublishers([{ name: PROJECT_PUBLISHER, queue: QUEUES.project }]),
	],
	controllers: [AppController],
})
export class AppModule {}
