import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {
	private readonly logger = new Logger(AppService.name);

	handleProcessPayment(order: unknown) {
		this.logger.log(`Processing payment for order: ${JSON.stringify(order)}`);
	}
}
