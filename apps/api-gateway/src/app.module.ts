import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { QUEUES, rmqOptions } from "@repo/rabbitmq";
import { AppController } from "./app.controller";
import { ORDER_CLIENT } from "./constants";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: ORDER_CLIENT,
				transport: Transport.RMQ,
				options: rmqOptions(QUEUES.order),
			},
		]),
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
