import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { QUEUES, rmqOptions } from "@repo/rabbitmq";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { NOTIFICATION_CLIENT } from "./constants";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: NOTIFICATION_CLIENT,
				transport: Transport.RMQ,
				options: rmqOptions(QUEUES.notification),
			},
		]),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
