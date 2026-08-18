import { createRmqMicroserviceWorker } from "@repo/nestjs";
import { QUEUES } from "@repo/rabbitmq";
import { AppModule } from "./app.module";

void createRmqMicroserviceWorker(AppModule, QUEUES.payment, 1);
