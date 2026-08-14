import type { QueueName } from "./queues";

export const RABBITMQ_URL =
	process.env["RABBITMQ_URL"] ?? "amqp://guest:guest@localhost:5672";

export const QUEUE_OPTIONS = {
	durable: true,
} as const;

export function rmqOptions(queue: QueueName) {
	return {
		urls: [RABBITMQ_URL],
		queue,
		queueOptions: QUEUE_OPTIONS,
	};
}
