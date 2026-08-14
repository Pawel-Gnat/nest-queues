import type { INestMicroservice } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { type QueueName, rmqOptions } from "@repo/rabbitmq";

export const createRmqMicroservice = async (
	module: Parameters<typeof NestFactory.createMicroservice>[0],
	queue: QueueName,
): Promise<INestMicroservice> => {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		module,
		{
			transport: Transport.RMQ,
			options: rmqOptions(queue),
		},
	);

	await app.listen();

	return app;
};
