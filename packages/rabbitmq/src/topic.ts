import { connect } from "amqplib";
import { RABBITMQ_URL } from "./constants";
import { QUEUES } from "./queues";

const PROJECTS_TOPIC = "projects.topic";

export const ROUTING_KEYS = {
	projectCreated: "project.created",
	taskCreate: "task.create",
	taskCreated: "task.created",
} as const;

export async function bindProjectsTopic() {
	const connection = await connect(RABBITMQ_URL);
	const channel = await connection.createChannel();

	await channel.assertExchange(PROJECTS_TOPIC, "topic", { durable: true });
	await channel.bindQueue(QUEUES.task, PROJECTS_TOPIC, ROUTING_KEYS.taskCreate);
	await channel.bindQueue(QUEUES.notification, PROJECTS_TOPIC, "*.created");

	await channel.close();
	await connection.close();
}

export async function publishTopic(
	routingKey: string,
	pattern: string,
	data: unknown,
) {
	const connection = await connect(RABBITMQ_URL);
	const channel = await connection.createChannel();

	channel.publish(
		PROJECTS_TOPIC,
		routingKey,
		Buffer.from(JSON.stringify({ pattern, data })),
		{ persistent: true },
	);

	await channel.close();
	await connection.close();
}
