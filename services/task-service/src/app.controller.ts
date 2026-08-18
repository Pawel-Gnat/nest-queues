import { Controller } from "@nestjs/common";
import {
	Ctx,
	EventPattern,
	Payload,
	type RmqContext,
} from "@nestjs/microservices";
import type { Project } from "@repo/api/schemas";
import { settleRmqMessage } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@EventPattern(EVENTS.task.create)
	handleCreateTasks(@Payload() project: Project, @Ctx() context: RmqContext) {
		return settleRmqMessage(context, () =>
			this.appService.createTasks(project),
		);
	}
}
