export const CLIENTS = {
	order: "order_client",
	payment: "payment_client",
	notification: "notification_client",
} as const;

export type ClientName = (typeof CLIENTS)[keyof typeof CLIENTS];

export const ORDER_CLIENT = CLIENTS.order;
export const PAYMENT_CLIENT = CLIENTS.payment;
export const NOTIFICATION_CLIENT = CLIENTS.notification;
