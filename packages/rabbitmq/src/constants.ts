export const RABBITMQ_URL =
	process.env["RABBITMQ_URL"] ?? "amqp://guest:guest@localhost:5672";

export const QUEUE_OPTIONS = {
	durable: true,
} as const;
