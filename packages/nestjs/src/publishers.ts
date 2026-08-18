export const PUBLISHERS = {
	order: "order_publisher",
	payment: "payment_publisher",
	notification: "notification_publisher",
} as const;

export type PublisherName = (typeof PUBLISHERS)[keyof typeof PUBLISHERS];

export const ORDER_PUBLISHER = PUBLISHERS.order;
export const PAYMENT_PUBLISHER = PUBLISHERS.payment;
export const NOTIFICATION_PUBLISHER = PUBLISHERS.notification;
