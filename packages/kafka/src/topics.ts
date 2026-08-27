import type { Kafka } from "kafkajs";
import { TOPIC_PARTITIONS, TOPICS, type TopicName } from "./constants";

export async function ensureTopic(
	kafka: Kafka,
	topic: TopicName = TOPICS.chatMessages,
	numPartitions = TOPIC_PARTITIONS[TOPICS.chatMessages],
): Promise<{ created: boolean; topics: string[] }> {
	const admin = kafka.admin();
	await admin.connect();

	try {
		const existing = await admin.listTopics();
		if (existing.includes(topic)) {
			return { created: false, topics: existing };
		}

		const created = await admin.createTopics({
			waitForLeaders: true,
			topics: [
				{
					topic,
					numPartitions,
					replicationFactor: 1,
				},
			],
		});

		return { created, topics: await admin.listTopics() };
	} finally {
		await admin.disconnect();
	}
}
