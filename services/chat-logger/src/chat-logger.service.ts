import {
	Injectable,
	Logger,
	type OnModuleDestroy,
	type OnModuleInit,
} from "@nestjs/common";
import {
	type ChatConsumedMessage,
	CONSUMER_GROUPS,
	runChatConsumer,
} from "@repo/kafka";
import type { Consumer } from "kafkajs";

@Injectable()
export class ChatLoggerService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(ChatLoggerService.name);
	private consumer: Consumer | undefined;

	async onModuleInit() {
		this.consumer = await runChatConsumer({
			clientId: process.env["LOGGER_INSTANCE"] ?? "chat-logger",
			groupId: CONSUMER_GROUPS.logger,
			fromBeginning: false,
			eachMessage: (message) => {
				this.logger.log(this.format(message));
			},
		});
	}

	async onModuleDestroy() {
		await this.consumer?.disconnect();
	}

	private format(message: ChatConsumedMessage) {
		const body = JSON.parse(message.value ?? "{}");

		return {
			groupId: message.groupId,
			partition: message.partition,
			offset: message.offset,
			key: message.key,
			body,
		};
	}
}
