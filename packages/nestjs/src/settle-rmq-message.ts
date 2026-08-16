import { Logger } from "@nestjs/common";
import type { RmqContext } from "@nestjs/microservices";
import {
	dlqFor,
	MAX_RETRY_ATTEMPTS,
	type QueueName,
	RETRY_HEADER,
	retryAttemptFromHeaders,
	retryQueueFor,
} from "@repo/rabbitmq";

const logger = new Logger("settleRmqMessage");

type RmqConsumeMessage = {
	content: Buffer;
	fields: { routingKey: string };
	properties: { headers?: unknown };
};

export async function settleRmqMessage<T>(
	context: RmqContext,
	work: () => Promise<T> | T,
): Promise<T> {
	const channel = context.getChannelRef();
	const message = context.getMessage() as RmqConsumeMessage;
	const attempt = retryAttemptFromHeaders(message.properties.headers);

	try {
		const result = await work();
		channel.ack(message);
		return result;
	} catch (error) {
		const queue = message.fields.routingKey as QueueName;
		const destination =
			attempt < MAX_RETRY_ATTEMPTS ? retryQueueFor(queue) : dlqFor(queue);

		logger.warn(`${attempt}/${MAX_RETRY_ATTEMPTS} → ${destination}`);

		await channel.sendToQueue(destination, message.content, {
			persistent: true,
			headers: { [RETRY_HEADER]: attempt },
		});
		channel.ack(message);

		throw error;
	}
}
