import { deadLetterArguments } from "./dead-letter";
import type { QueueName } from "./queues";

export const RETRY_TTL_MS = 5000;
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_HEADER = "x-retry";

export function retryQueueFor(queue: QueueName) {
	return queue.replace(/_queue$/, `_retry_${RETRY_TTL_MS / 1000}s`);
}

export function retryQueueArguments(sourceQueue: QueueName) {
	return {
		"x-message-ttl": RETRY_TTL_MS,
		...deadLetterArguments(sourceQueue),
	};
}

export function retryAttemptFromHeaders(headers: unknown) {
	if (!headers || typeof headers !== "object") {
		return 1;
	}

	const value = (headers as Record<string, unknown>)[RETRY_HEADER];
	return Number(value ?? 0) + 1;
}
