import { connect } from "amqplib";
import { RABBITMQ_URL } from "./constants";
import { QUEUES } from "./queues";

const ORDERS_FANOUT = "orders.fanout";

export async function bindOrdersFanout() {
	const connection = await connect(RABBITMQ_URL);
	const channel = await connection.createChannel();

	await channel.assertExchange(ORDERS_FANOUT, "fanout", { durable: true });
	await channel.bindQueue(QUEUES.payment, ORDERS_FANOUT, "");
	await channel.bindQueue(QUEUES.notification, ORDERS_FANOUT, "");

	await channel.close();
	await connection.close();
}

export async function publishFanout(pattern: string, data: unknown) {
	const connection = await connect(RABBITMQ_URL);
	const channel = await connection.createChannel();

	channel.publish(
		ORDERS_FANOUT,
		"",
		Buffer.from(JSON.stringify({ pattern, data })),
		{ persistent: true },
	);

	await channel.close();
	await connection.close();
}
