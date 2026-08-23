import {
	Injectable,
	Logger,
	type OnModuleDestroy,
	type OnModuleInit,
} from "@nestjs/common";
import type { Project, Task } from "@repo/api/schemas";
import {
	addQueueJob,
	BULLMQ_JOBS,
	BULLMQ_QUEUES,
	type BullmqRuntime,
	createBullmqRuntime,
	eventJobId,
	type Job,
	nameContainsFail,
	REPORT_PROJECT_PRIORITY,
	REPORT_TASK_PRIORITY,
	REPORT_WORKER_OPTIONS,
} from "@repo/bullmq";
import { sleep } from "@repo/nestjs";
import { EVENTS } from "@repo/rabbitmq";

type ProjectReportJob = { kind: "project"; project: Project };
type TaskReportJob = { kind: "task"; task: Task };
type ReportJob = ProjectReportJob | TaskReportJob;

@Injectable()
export class ReportService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(ReportService.name);
	private runtime!: BullmqRuntime<ReportJob>;

	async onModuleInit() {
		this.runtime = await createBullmqRuntime(
			BULLMQ_QUEUES.report,
			(job) => this.processReport(job),
			REPORT_WORKER_OPTIONS,
			this.logger,
		);
	}

	async onModuleDestroy() {
		await this.runtime?.close();
	}

	async generateProjectReport(project: Project) {
		await addQueueJob(
			this.runtime.queue,
			this.logger,
			BULLMQ_JOBS.projectReport,
			{ kind: "project", project },
			{
				jobId: eventJobId(EVENTS.project.created, project.id),
				priority: REPORT_PROJECT_PRIORITY,
			},
		);
	}

	async generateTaskReport(task: Task) {
		await addQueueJob(
			this.runtime.queue,
			this.logger,
			BULLMQ_JOBS.taskReport,
			{ kind: "task", task },
			{
				jobId: eventJobId(EVENTS.task.created, task.id),
				priority: REPORT_TASK_PRIORITY,
			},
		);
	}

	private async processReport(job: Job<ReportJob>) {
		this.logger.log(
			`generating ${job.name} ${job.id} attempt=${job.attemptsMade + 1} state=${await job.getState()}`,
		);
		if (job.data.kind === "project") {
			if (nameContainsFail(job.data.project.name)) {
				throw new Error(
					`simulated report failure for project ${job.data.project.name}`,
				);
			}
			await sleep(3000);
			this.logger.log(`generated project report ${job.data.project.id}`);
			return;
		}
		await sleep(3000);
		this.logger.log(`generated task report ${job.data.task.id}`);
	}
}
