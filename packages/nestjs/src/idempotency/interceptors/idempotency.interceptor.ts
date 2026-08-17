import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	Logger,
	type NestInterceptor,
} from "@nestjs/common";
import type { RmqContext } from "@nestjs/microservices";
import { type Observable, of } from "rxjs";
import { concatMap } from "rxjs/operators";
import type { IdempotencyStore } from "../store/idempotency.store";

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
	private readonly logger = new Logger(IdempotencyInterceptor.name);

	constructor(private readonly store: IdempotencyStore) {}

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<unknown>> {
		const rpc = context.switchToRpc();
		const { id } = rpc.getData();
		const rmq = rpc.getContext<RmqContext>();
		const pattern = String(rmq.getPattern());

		const cached = await this.store.get(pattern, id);
		if (cached != null) {
			this.logger.warn(`skipped duplicate ${pattern} ${id}`);
			rmq.getChannelRef().ack(rmq.getMessage());
			return of(cached);
		}

		return next.handle().pipe(
			concatMap(async (result: unknown) => {
				await this.store.claim(pattern, id, result);
				return result;
			}),
		);
	}
}
