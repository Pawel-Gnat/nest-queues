export const EVENTS = {
	order: {
		created: "order_created",
	},
	payment: {
		process: "process_payment",
	},
	notification: {
		order: "send_order_notification",
		payment: "send_payment_notification",
	},
} as const;

export type EventName =
	| (typeof EVENTS.order)[keyof typeof EVENTS.order]
	| (typeof EVENTS.payment)[keyof typeof EVENTS.payment]
	| (typeof EVENTS.notification)[keyof typeof EVENTS.notification];
