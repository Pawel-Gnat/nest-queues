export const KAFKA_BROKERS = process.env["KAFKA_BROKERS"] ?? "localhost:9092";

export const TOPICS = {
	chatMessages: "chat.messages",
} as const;

export type TopicName = (typeof TOPICS)[keyof typeof TOPICS];

export const TOPIC_PARTITIONS = {
	[TOPICS.chatMessages]: 3,
} as const;

export const CONSUMER_GROUPS = {
	logger: "chat-logger",
	moderator: "chat-moderator",
} as const;
