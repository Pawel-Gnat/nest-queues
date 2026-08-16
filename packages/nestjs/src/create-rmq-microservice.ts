import type { INestMicroservice } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import {
	assertDurableQueue,
	dlqFor,
	type QueueName,
	type RmqOptionsExtra,
	retryQueueArguments,
	retryQueueFor,
	rmqOptions,
} from "@repo/rabbitmq";

export const createRmqMicroservice = async (
	module: Parameters<typeof NestFactory.createMicroservice>[0],
	queue: QueueName,
	extra?: RmqOptionsExtra,
): Promise<INestMicroservice> => {
	await assertDurableQueue(dlqFor(queue));
	await assertDurableQueue(retryQueueFor(queue), {
		arguments: retryQueueArguments(queue),
	});

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		module,
		{
			transport: Transport.RMQ,
			options: rmqOptions(queue, extra),
		},
	);

	await app.listen();

	return app;
};
