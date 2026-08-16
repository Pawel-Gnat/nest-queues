import type { INestMicroservice } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import {
	assertDurableQueue,
	deadLetterArguments,
	dlqFor,
	type QueueName,
	type RmqOptionsExtra,
	rmqOptions,
} from "@repo/rabbitmq";

export const createRmqMicroservice = async (
	module: Parameters<typeof NestFactory.createMicroservice>[0],
	queue: QueueName,
	extra?: RmqOptionsExtra,
): Promise<INestMicroservice> => {
	const dlq = dlqFor(queue);
	await assertDurableQueue(dlq);

	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		module,
		{
			transport: Transport.RMQ,
			options: rmqOptions(queue, {
				...extra,
				queueOptions: {
					arguments: deadLetterArguments(dlq),
				},
			}),
		},
	);

	await app.listen();

	return app;
};
