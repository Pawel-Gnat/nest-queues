import { Injectable, Logger } from "@nestjs/common";
import type { Project, Task } from "@repo/api/schemas";
import { IdempotencyStore, sleep } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	constructor(private readonly idempotency: IdempotencyStore) {}

	async handleProjectCreated(project: Project) {
		await this.saveOnce(EVENTS.project.created, project.id, () => {
			this.logger.log(
				`saved project notification ${project.id}: ${JSON.stringify(project)}`,
			);
		});
	}

	async handleTaskCreated(task: Task) {
		await this.saveOnce(EVENTS.task.created, task.id, () => {
			this.logger.log(
				`saved task notification ${task.id}: ${JSON.stringify(task)}`,
			);
		});
	}

	private async saveOnce(pattern: string, id: string, save: () => void) {
		await sleep();

		const claimed = await this.idempotency.claim(pattern, id, true);
		if (!claimed) {
			this.logger.warn(`skipped duplicate ${pattern} ${id}`);
			return;
		}

		save();
	}
}
