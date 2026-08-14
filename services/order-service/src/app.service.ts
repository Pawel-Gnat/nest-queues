import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	handleOrderCreate(order: unknown) {
		this.logger.log(`Received order: ${JSON.stringify(order)}`);
	}
}
