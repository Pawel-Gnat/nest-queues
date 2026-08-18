import { QUEUE_OPTIONS, RABBITMQ_URL } from "./constants";
import type { QueueName } from "./queues";
import { workQueueArguments } from "./retry";

export { QUEUE_OPTIONS, RABBITMQ_URL } from "./constants";

function queueConfig(queue: QueueName) {
	return {
		urls: [RABBITMQ_URL],
		queue,
		persistent: true,
		queueOptions: {
			...QUEUE_OPTIONS,
			arguments: workQueueArguments(queue),
		},
	};
}

export function rmqWorkerOptions(queue: QueueName, prefetchCount = 1) {
	return {
		...queueConfig(queue),
		noAck: false,
		prefetchCount,
	};
}

export function rmqPublisherOptions(queue: QueueName) {
	return queueConfig(queue);
}
