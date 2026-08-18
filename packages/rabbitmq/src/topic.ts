import { connect } from "amqplib";
import { RABBITMQ_URL } from "./constants";
import { QUEUES } from "./queues";

const ORDERS_TOPIC = "orders.topic";

export const ROUTING_KEYS = {
	orderCreated: "order.created",
	paymentProcess: "payment.process",
	paymentCompleted: "payment.completed",
} as const;

export async function bindOrdersTopic() {
	const connection = await connect(RABBITMQ_URL);
	const channel = await connection.createChannel();

	await channel.assertExchange(ORDERS_TOPIC, "topic", { durable: true });
	await channel.bindQueue(
		QUEUES.payment,
		ORDERS_TOPIC,
		ROUTING_KEYS.paymentProcess,
	);
	await channel.bindQueue(QUEUES.notification, ORDERS_TOPIC, "order.*");
	await channel.bindQueue(
		QUEUES.notification,
		ORDERS_TOPIC,
		ROUTING_KEYS.paymentCompleted,
	);

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
		ORDERS_TOPIC,
		routingKey,
		Buffer.from(JSON.stringify({ pattern, data })),
		{ persistent: true },
	);

	await channel.close();
	await connection.close();
}
