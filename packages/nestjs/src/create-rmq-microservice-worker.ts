import type { INestMicroservice } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import {
	ensureBrokerQueues,
	type QueueName,
	rmqWorkerOptions,
} from "@repo/rabbitmq";

export const createRmqMicroserviceWorker = async (
	module: Parameters<typeof NestFactory.createMicroservice>[0],
	queue: QueueName,
	prefetchCount = 1,
): Promise<INestMicroservice> => {
	await ensureBrokerQueues();

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		module,
		{
			transport: Transport.RMQ,
			options: rmqWorkerOptions(queue, prefetchCount),
		},
	);

	await app.listen();

	return app;
};
