import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { QUEUES, rmqOptions } from "@repo/rabbitmq";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.RMQ,
			options: rmqOptions(QUEUES.payment),
		},
	);

	await app.listen();
}

void bootstrap();
