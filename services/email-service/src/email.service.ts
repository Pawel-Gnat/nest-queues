import {
	Injectable,
	Logger,
	type OnModuleDestroy,
	type OnModuleInit,
} from "@nestjs/common";
import type { Project } from "@repo/api/schemas";
import {
	addQueueJob,
	BULLMQ_JOBS,
	BULLMQ_QUEUES,
	type BullmqRuntime,
	createBullmqRuntime,
	EMAIL_JOB_OPTIONS,
	EMAIL_WORKER_OPTIONS,
	eventJobId,
	type Job,
	nameContainsFail,
} from "@repo/bullmq";
import { sleep } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";

type EmailJob = { project: Project };

@Injectable()
export class EmailService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(EmailService.name);
	private runtime!: BullmqRuntime<EmailJob>;

	async onModuleInit() {
		this.runtime = await createBullmqRuntime(
			BULLMQ_QUEUES.email,
			(job) => this.processSendEmail(job),
			EMAIL_WORKER_OPTIONS,
			this.logger,
		);
	}

	async onModuleDestroy() {
		await this.runtime?.close();
	}

	async sendEmail(project: Project) {
		await addQueueJob(
			this.runtime.queue,
			this.logger,
			BULLMQ_JOBS.sendEmail,
			{ project },
			{
				...EMAIL_JOB_OPTIONS,
				jobId: eventJobId(EVENTS.project.created, project.id),
			},
		);
	}

	private async processSendEmail(job: Job<EmailJob>) {
		const { project } = job.data;
		this.logger.log(
			`send-email ${job.id} attempt=${job.attemptsMade + 1} state=${await job.getState()}`,
		);
		if (nameContainsFail(project.name)) {
			throw new Error(`simulated SMTP failure for project ${project.name}`);
		}
		await sleep(200);
		this.logger.log(`sent email for project ${project.id}`);
	}
}
