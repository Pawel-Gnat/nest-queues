import {
	Injectable,
	type OnModuleDestroy,
	type OnModuleInit,
} from "@nestjs/common";
import {
	type ChatMessagePayload,
	createKafka,
	ensureTopic,
	produceChatMessage,
} from "@repo/kafka";

@Injectable()
export class ChatService implements OnModuleInit, OnModuleDestroy {
	private readonly kafka = createKafka("chat-api");
	private readonly producer = this.kafka.producer();

	async onModuleInit() {
		await ensureTopic(this.kafka);
		await this.producer.connect();
	}

	async onModuleDestroy() {
		await this.producer.disconnect();
	}

	async send(payload: ChatMessagePayload) {
		const message = {
			...payload,
			createdAt: new Date().toISOString(),
		};
		const meta = await produceChatMessage(this.producer, message);

		return {
			...message,
			partition: meta.partition,
			offset: meta.offset,
		};
	}
}
