import { createRmqMicroservice } from "@repo/nestjs";
import { QUEUES } from "@repo/rabbitmq";
import { AppModule } from "./app.module";

void createRmqMicroservice(AppModule, QUEUES.payment);
