import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { EmailService } from "./email.service";

@Module({
	controllers: [AppController],
	providers: [EmailService],
})
export class AppModule {}
