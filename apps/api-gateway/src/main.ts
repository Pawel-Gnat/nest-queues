import { NestFactory } from "@nestjs/core";
import { ensureBrokerQueues } from "@repo/rabbitmq";

import { AppModule } from "./app.module";

async function bootstrap() {
	await ensureBrokerQueues();
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	app.setGlobalPrefix("api");
	await app.listen(3000);
}

void bootstrap();
