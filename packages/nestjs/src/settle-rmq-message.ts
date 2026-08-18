import { Logger } from "@nestjs/common";
import type { RmqContext } from "@nestjs/microservices";
import { deliveryCountFromHeaders, MAX_RETRY_ATTEMPTS } from "@repo/rabbitmq";

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
	const attempt = deliveryCountFromHeaders(message.properties.headers) + 1;

	try {
		const result = await work();
		channel.ack(message);
		return result;
	} catch (error) {
		logger.warn(
			`${message.fields.routingKey} ${attempt}/${MAX_RETRY_ATTEMPTS} → reject requeue`,
		);
		channel.reject(message, true);
		throw error;
	}
}
