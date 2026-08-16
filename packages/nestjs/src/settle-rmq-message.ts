import type { RmqContext } from "@nestjs/microservices";

export async function settleRmqMessage<T>(
	context: RmqContext,
	work: () => Promise<T> | T,
): Promise<T> {
	const channel = context.getChannelRef();
	const message = context.getMessage();

	try {
		const result = await work();
		channel.ack(message);
		return result;
	} catch (error) {
		channel.nack(message, false, false);
		throw error;
	}
}
