import { Module } from "@nestjs/common";
import { ChatModeratorService } from "./chat-moderator.service";

@Module({
	providers: [ChatModeratorService],
})
export class AppModule {}
