export const QUEUES = {
	order: "order_queue",
	payment: "payment_queue",
	notification: "notification_queue",
} as const;

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES];
