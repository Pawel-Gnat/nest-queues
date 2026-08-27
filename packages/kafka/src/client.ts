import { Kafka } from "kafkajs";
import { KAFKA_BROKERS } from "./constants";

export function kafkaBrokers(): string[] {
	return KAFKA_BROKERS.split(",")
		.map((broker) => broker.trim())
		.filter(Boolean);
}

export function createKafka(clientId = "queues-lab"): Kafka {
	return new Kafka({
		clientId,
		brokers: kafkaBrokers(),
	});
}
