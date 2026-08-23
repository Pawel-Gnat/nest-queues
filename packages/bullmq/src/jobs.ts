import type { Job, JobsOptions, Queue } from "bullmq";
import { isDuplicateJobId } from "./errors";
import type { BullmqLogger } from "./logger";
import { DEFAULT_JOB_OPTIONS } from "./retry";

export async function addQueueJob<Data>(
	queue: Queue<Data>,
	logger: BullmqLogger,
	name: string,
	data: Data,
	options: JobsOptions,
): Promise<Job<Data> | undefined> {
	try {
		const job = (await (queue as Queue).add(name, data, {
			...DEFAULT_JOB_OPTIONS,
			...options,
		})) as Job<Data>;

		const extras = [
			options.delay != null ? `delay=${options.delay}ms` : null,
			options.priority != null ? `priority=${options.priority}` : null,
		]
			.filter(Boolean)
			.join(" ");

		logger.log(
			`queued ${job.name} ${job.id}${extras ? ` ${extras}` : ""} state=${await job.getState()}`,
		);

		return job;
	} catch (error) {
		if (isDuplicateJobId(error)) {
			logger.warn(`skipped duplicate ${options.jobId ?? name}`);
			return undefined;
		}
		throw error;
	}
}
