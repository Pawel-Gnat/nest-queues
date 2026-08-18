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
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@EventPattern(EVENTS.project.created)
	handleProjectCreated(
		@Payload() project: Project,
		@Ctx() context: RmqContext,
	) {
		return settleRmqMessage(context, () =>
			this.appService.handleProjectCreated(project),
		);
	}

	@EventPattern(EVENTS.task.created)
	handleTaskCreated(@Payload() task: Task, @Ctx() context: RmqContext) {
		return settleRmqMessage(context, () =>
			this.appService.handleTaskCreated(task),
		);
	}
}
