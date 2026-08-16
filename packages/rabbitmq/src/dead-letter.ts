import { connect } from "amqplib";
import { QUEUE_OPTIONS, RABBITMQ_URL } from "./connection";
import type { QueueName } from "./queues";

export function dlqFor(queue: QueueName) {
	return queue.replace(/_queue$/, "_dlq");
}

export function deadLetterArguments(dlq: string) {
	return {
		"x-dead-letter-exchange": "",
		"x-dead-letter-routing-key": dlq,
	};
}

export async function assertDurableQueue(name: string) {
	const connection = await connect(RABBITMQ_URL);
	const channel = await connection.createChannel();

	await channel.assertQueue(name, QUEUE_OPTIONS);

	await channel.close();
	await connection.close();
}
