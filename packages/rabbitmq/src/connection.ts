import type { QueueName } from "./queues";

export const RABBITMQ_URL =
	process.env["RABBITMQ_URL"] ?? "amqp://guest:guest@localhost:5672";

export const QUEUE_OPTIONS = {
	durable: true,
} as const;

export type RmqOptionsExtra = {
	noAck?: boolean;
	prefetchCount?: number;
	persistent?: boolean;
	queueOptions?: {
		durable?: boolean;
		arguments?: Record<string, unknown>;
	};
};

export function rmqOptions(queue: QueueName, extra?: RmqOptionsExtra) {
	const { queueOptions, ...rest } = extra ?? {};

	return {
		urls: [RABBITMQ_URL],
		queue,
		queueOptions: { ...QUEUE_OPTIONS, ...queueOptions },
		persistent: true,
		...rest,
	};
}
