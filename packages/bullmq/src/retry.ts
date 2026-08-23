import type { JobsOptions, WorkerOptions } from "bullmq";

/** https://docs.bullmq.io/guide/retrying-failing-jobs */
export const DEFAULT_JOB_OPTIONS: Pick<JobsOptions, "attempts" | "backoff"> = {
	attempts: 3,
	backoff: { type: "exponential", delay: 1000 },
};

export const EMAIL_JOB_OPTIONS: JobsOptions = {
	...DEFAULT_JOB_OPTIONS,
	delay: 5000,
	priority: 10,
};

export const REPORT_PROJECT_PRIORITY = 1;
export const REPORT_TASK_PRIORITY = 5;

export const EMAIL_WORKER_OPTIONS: Pick<
	WorkerOptions,
	"concurrency" | "limiter"
> = {
	concurrency: 1,
	limiter: { max: 1, duration: 5000 },
};

export const REPORT_WORKER_OPTIONS: Pick<
	WorkerOptions,
	"concurrency" | "lockDuration" | "stalledInterval"
> = {
	concurrency: 3,
	lockDuration: 5000,
	stalledInterval: 5000,
};
