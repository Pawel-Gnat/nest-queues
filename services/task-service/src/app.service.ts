import { Injectable, Logger } from "@nestjs/common";
import type { Project } from "@repo/api/schemas";
import { IdempotencyStore, sleep } from "@repo/nestjs";
import { EVENTS, publishTopic, ROUTING_KEYS } from "@repo/rabbitmq";

/** POST /api/project with a task titled "dlq" to send the message to DLQ after 3 throws. */
export const DLQ_DEMO_TASK_TITLE = "dlq";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	constructor(private readonly idempotency: IdempotencyStore) {}

	async createTasks(project: Project) {
		for (const task of project.tasks) {
			if (task.title === DLQ_DEMO_TASK_TITLE) {
				this.logger.error(
					`pid=${process.pid} demo DLQ — throwing for task ${task.id}`,
				);
				throw new Error(`demo DLQ for task ${task.title}`);
			}

			this.logger.log(
				`pid=${process.pid} saving task ${task.id} (kill the process here to test retry)`,
			);
			await sleep();

			const claimed = await this.idempotency.claim(
				EVENTS.task.created,
				task.id,
				true,
			);

			if (!claimed) {
				this.logger.warn(`pid=${process.pid} duplicate task ${task.id}`);
				continue;
			}

			this.logger.log(
				`pid=${process.pid} saved task ${task.id}: ${JSON.stringify(task)}`,
			);

			await publishTopic(ROUTING_KEYS.taskCreated, EVENTS.task.created, task);
		}
	}
}
