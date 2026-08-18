import { Injectable, Logger } from "@nestjs/common";
import type { Project } from "@repo/api/schemas";
import { sleep } from "@repo/nestjs";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	async create(project: Project) {
		this.logger.log(
			`pid=${process.pid} saving project ${project.id} (kill the process here to test retry)`,
		);
		await sleep();
		this.logger.log(
			`pid=${process.pid} saved project ${project.id}: ${JSON.stringify(project)}`,
		);
	}
}
