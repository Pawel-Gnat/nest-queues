import type { Consumer } from "kafkajs";
import { createKafka } from "./client";
import { TOPICS } from "./constants";

export type ChatConsumedMessage = {
	groupId: string;
	topic: string;
	partition: number;
	offset: string;
	key: string | null;
	value: string | null;
};

export async function runChatConsumer(options: {
	clientId: string;
	groupId: string;
	fromBeginning?: boolean;
	eachMessage: (message: ChatConsumedMessage) => Promise<void> | void;
}): Promise<Consumer> {
	const kafka = createKafka(options.clientId);
	const consumer = kafka.consumer({ groupId: options.groupId });

	consumer.on(consumer.events.GROUP_JOIN, ({ payload }) => {
		const assigned = Object.entries(payload.memberAssignment).map(
			([topic, partitions]) => ({ topic, partitions }),
		);
		console.log(
			JSON.stringify({
				event: "GROUP_JOIN",
				groupId: options.groupId,
				memberId: payload.memberId,
				assigned,
			}),
		);
	});

	await consumer.connect();
	await consumer.subscribe({
		topic: TOPICS.chatMessages,
		// false = only new messages. Old log stays; this group starts at the end.
		fromBeginning: options.fromBeginning ?? false,
	});

	void consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			await options.eachMessage({
				groupId: options.groupId,
				topic,
				partition,
				offset: message.offset,
				key: message.key?.toString() ?? null,
				value: message.value?.toString() ?? null,
			});
		},
	});

	return consumer;
}
