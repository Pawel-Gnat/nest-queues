import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import type {
	Project,
	ProjectPayload,
	ProjectResponse,
} from "@repo/api/schemas";
import { PROJECT_PUBLISHER } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";
import { randomUUID } from "crypto";

@Controller()
export class AppController {
	constructor(
		@Inject(PROJECT_PUBLISHER) private readonly projects: ClientProxy,
	) {}

	@Post("project")
	createProject(@Body() payload: ProjectPayload): ProjectResponse {
		const id = randomUUID();
		const project: Project = {
			id,
			name: payload.name,
			tasks: payload.tasks.map((task) => ({
				id: randomUUID(),
				projectId: id,
				title: task.title,
			})),
			createdAt: new Date().toISOString(),
		};

		this.projects.emit(EVENTS.project.created, project);

		return { data: project };
	}
}
