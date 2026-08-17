import { Module } from "@nestjs/common";
import { IdempotencyModule } from "@repo/nestjs";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
	imports: [IdempotencyModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
