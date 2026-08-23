export const BULLMQ_QUEUES = {
	email: "email",
	report: "report",
} as const;

export type BullmqQueueName =
	(typeof BULLMQ_QUEUES)[keyof typeof BULLMQ_QUEUES];

export const BULLMQ_JOBS = {
	sendEmail: "send-email",
	projectReport: "project-report",
	taskReport: "task-report",
} as const;
