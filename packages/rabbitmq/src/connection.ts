import type { QueueName } from "./queues";

export const RABBITMQ_URL =
	process.env["RABBITMQ_URL"] ?? "amqp://guest:guest@localhost:5672";

export const QUEUE_OPTIONS = {
	durable: true,
} as const;

export type RmqOptionsExtra = {
	noAck?: boolean;
	prefetchCount?: number;
};

export function rmqOptions(queue: QueueName, extra?: RmqOptionsExtra) {
	return {
		urls: [RABBITMQ_URL],
		queue,
		queueOptions: QUEUE_OPTIONS,
		...extra,
	};
}
