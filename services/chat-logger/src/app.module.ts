import { Module } from "@nestjs/common";
import { ChatLoggerService } from "./chat-logger.service";

@Module({
	providers: [ChatLoggerService],
})
export class AppModule {}
