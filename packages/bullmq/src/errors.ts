export function isDuplicateJobId(error: unknown) {
	return error instanceof Error && /already exists/i.test(error.message);
}

export function nameContainsFail(name: string) {
	return name.toLowerCase().includes("fail");
}

/** Same identity as RMQ + IdempotencyStore. BullMQ custom ids cannot contain ":". https://docs.bullmq.io/guide/jobs/job-ids */
export function eventJobId(pattern: string, entityId: string) {
	return `${pattern}_${entityId}`;
}
