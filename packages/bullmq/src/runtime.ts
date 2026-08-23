import {
	type Processor,
	Queue,
	QueueEvents,
	Worker,
	type WorkerOptions,
} from "bullmq";
import { getBullmqConnectionOptions } from "./connection";
import type { BullmqLogger } from "./logger";

export type BullmqRuntime<Data> = {
	queue: Queue<Data>;
	close: () => Promise<void>;
};

function attachJobLogs<Data>(
	worker: Worker<Data>,
	queueEvents: QueueEvents,
	logger: BullmqLogger,
) {
	worker.on("active", (job) => {
		logger.log(`active ${job.id} ${job.name} attempt=${job.attemptsMade + 1}`);
	});
	worker.on("completed", (job) => {
		logger.log(`completed ${job.id} ${job.name}`);
	});
	worker.on("failed", (job, error) => {
		logger.error(
			`failed ${job?.id} ${job?.name} attempt=${job?.attemptsMade} ${error.message}`,
		);
	});
	worker.on("stalled", (jobId) => {
		logger.warn(`stalled ${jobId} → retry`);
	});
	queueEvents.on("delayed", ({ jobId }) => {
		logger.log(`delayed ${jobId}`);
	});
}

export async function createBullmqRuntime<Data>(
	queueName: string,
	processor: Processor<Data>,
	workerOptions: Omit<WorkerOptions, "connection">,
	logger: BullmqLogger,
): Promise<BullmqRuntime<Data>> {
	const connection = getBullmqConnectionOptions();
	const queue = new Queue<Data>(queueName, { connection });
	const queueEvents = new QueueEvents(queueName, { connection });
	const worker = new Worker<Data>(queueName, processor, {
		connection,
		...workerOptions,
	});

	attachJobLogs(worker, queueEvents, logger);
	await queueEvents.waitUntilReady();

	return {
		queue,
		async close() {
			await worker.close();
			await queueEvents.close();
			await queue.close();
		},
	};
}
