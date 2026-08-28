import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ChatService } from "./chat.service";

@Module({
	controllers: [AppController],
	providers: [ChatService],
})
export class AppModule {}
