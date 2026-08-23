import { Controller } from "@nestjs/common";
import {
	Ctx,
	EventPattern,
	Payload,
	type RmqContext,
} from "@nestjs/microservices";
import type { Project, Task } from "@repo/api/schemas";
import { settleRmqMessage } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";
import { ReportService } from "./report.service";

@Controller()
export class AppController {
	constructor(private readonly reportService: ReportService) {}

	@EventPattern(EVENTS.project.created)
	handleProjectCreated(
		@Payload() project: Project,
		@Ctx() context: RmqContext,
	) {
		return settleRmqMessage(context, () =>
			this.reportService.generateProjectReport(project),
		);
	}

	@EventPattern(EVENTS.task.created)
	handleTaskCreated(@Payload() task: Task, @Ctx() context: RmqContext) {
		return settleRmqMessage(context, () =>
			this.reportService.generateTaskReport(task),
		);
	}
}
