import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { ORDER_SERVICE_RABBITMQ } from "./constants";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: ORDER_SERVICE_RABBITMQ,
				transport: Transport.RMQ,
				options: {
					urls: ["amqp://guest:guest@localhost:5672"],
					queue: "order_queue",
					queueOptions: { durable: true },
				},
			},
		]),
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
