import type { Producer } from "kafkajs";
import { TOPICS } from "./constants";

export type ChatMessagePayload = {
	conversationId: string;
	author: string;
	text: string;
};

export type ChatMessage = ChatMessagePayload & {
	createdAt: string;
};

export type ProduceResult = {
	partition: number;
	offset: string;
};

export async function produceChatMessage(
	producer: Producer,
	message: ChatMessage,
): Promise<ProduceResult> {
	const [meta] = await producer.send({
		topic: TOPICS.chatMessages,
		messages: [
			{
				key: message.conversationId,
				value: JSON.stringify(message),
			},
		],
	});

	if (!meta) {
		throw new Error("Kafka send returned no metadata");
	}

	const offset = meta.offset ?? meta.baseOffset;

	if (offset == null || offset === "") {
		throw new Error(`Kafka send missing offset: ${JSON.stringify(meta)}`);
	}

	return {
		partition: meta.partition,
		offset: String(offset),
	};
}
