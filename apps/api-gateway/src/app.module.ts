import { Module } from "@nestjs/common";
import { ORDER_CLIENT, registerRmqClients } from "@repo/nestjs";
import { QUEUES } from "@repo/rabbitmq";
import { AppController } from "./app.controller";

@Module({
	imports: [registerRmqClients([{ name: ORDER_CLIENT, queue: QUEUES.order }])],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
