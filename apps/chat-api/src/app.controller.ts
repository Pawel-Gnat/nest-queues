import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";

type ChatMessageBody = {
	conversationId?: string;
	author?: string;
	text?: string;
};

@Controller("chat")
export class AppController {
	constructor(private readonly chat: ChatService) {}

	@Post("messages")
	postMessage(@Body() body: ChatMessageBody) {
		const conversationId = body.conversationId?.trim();
		const author = body.author?.trim();
		const text = body.text?.trim();

		if (!conversationId || !author || !text) {
			throw new BadRequestException(
				"conversationId, author and text are required",
			);
		}

		return this.chat.send({ conversationId, author, text });
	}
}
