export const EVENTS = {
	project: {
		created: "project_created",
	},
	task: {
		create: "create_tasks",
		created: "task_created",
	},
} as const;

export type EventName =
	| (typeof EVENTS.project)[keyof typeof EVENTS.project]
	| (typeof EVENTS.task)[keyof typeof EVENTS.task];
