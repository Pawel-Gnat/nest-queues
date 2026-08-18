import { Controller } from "@nestjs/common";
import {
	Ctx,
	EventPattern,
	Payload,
	type RmqContext,
} from "@nestjs/microservices";
import type { Project } from "@repo/api/schemas";
import { settleRmqMessage } from "@repo/nestjs";
import { EVENTS, publishTopic, ROUTING_KEYS } from "@repo/rabbitmq";
import { AppService } from "./app.service";

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@EventPattern(EVENTS.project.created)
	handleProjectCreate(@Payload() project: Project, @Ctx() context: RmqContext) {
		return settleRmqMessage(context, async () => {
			await this.appService.create(project);
			await publishTopic(
				ROUTING_KEYS.projectCreated,
				EVENTS.project.created,
				project,
			);
			await publishTopic(ROUTING_KEYS.taskCreate, EVENTS.task.create, project);
		});
	}
}
