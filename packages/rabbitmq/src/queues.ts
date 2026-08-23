export const QUEUES = {
	project: "project_queue",
	task: "task_queue",
	notification: "notification_queue",
	email: "email_queue",
	report: "report_queue",
} as const;

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES];
