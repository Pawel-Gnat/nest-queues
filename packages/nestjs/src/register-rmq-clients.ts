import type { DynamicModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { type QueueName, rmqOptions } from "@repo/rabbitmq";
import type { ClientName } from "./clients";

export type RmqClientConfig = {
	name: ClientName;
	queue: QueueName;
};

export const registerRmqClients = (clients: RmqClientConfig[]): DynamicModule =>
	ClientsModule.register(
		clients.map(({ name, queue }) => ({
			name,
			transport: Transport.RMQ,
			options: rmqOptions(queue),
		})),
	);
