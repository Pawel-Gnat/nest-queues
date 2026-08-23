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
import { EmailService } from "./email.service";

@Controller()
export class AppController {
	constructor(private readonly emailService: EmailService) {}

	@EventPattern(EVENTS.project.created)
	handleProjectCreated(
		@Payload() project: Project,
		@Ctx() context: RmqContext,
	) {
		return settleRmqMessage(context, () =>
			this.emailService.sendEmail(project),
		);
	}
}
