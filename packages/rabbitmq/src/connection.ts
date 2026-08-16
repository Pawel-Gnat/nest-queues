import { QUEUE_OPTIONS, RABBITMQ_URL } from "./constants";
import type { QueueName } from "./queues";

export { QUEUE_OPTIONS, RABBITMQ_URL } from "./constants";

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
