import { deadLetterArguments, dlqFor } from "./dead-letter";
import type { QueueName } from "./queues";

export const RETRY_TTL_MS = 5000;
export const MAX_RETRY_ATTEMPTS = 3;

export function workQueueArguments(queue: QueueName) {
	return {
		"x-queue-type": "quorum",
		"x-delivery-limit": MAX_RETRY_ATTEMPTS,
		"x-delayed-retry-type": "failed",
		"x-delayed-retry-min": RETRY_TTL_MS,
		"x-delayed-retry-max": RETRY_TTL_MS,
		...deadLetterArguments(dlqFor(queue)),
	};
}

export function deliveryCountFromHeaders(headers: unknown) {
	const value = (headers as Record<string, unknown> | undefined)?.[
		"x-delivery-count"
	];
	return Number(value ?? 0);
}
