import type { DynamicModule } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { type QueueName, rmqPublisherOptions } from "@repo/rabbitmq";
import type { PublisherName } from "./publishers";

export type RmqPublisherConfig = {
	name: PublisherName;
	queue: QueueName;
};

export const registerRmqPublishers = (
	publishers: RmqPublisherConfig[],
): DynamicModule =>
	ClientsModule.register(
		publishers.map(({ name, queue }) => ({
			name,
			transport: Transport.RMQ,
			options: rmqPublisherOptions(queue),
		})),
	);
