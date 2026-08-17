import { Module } from "@nestjs/common";
import { RedisModule } from "../redis/redis.module";
import { IdempotencyInterceptor } from "./interceptors/idempotency.interceptor";
import { IdempotencyStore } from "./store/idempotency.store";

@Module({
	imports: [RedisModule],
	providers: [IdempotencyStore, IdempotencyInterceptor],
	exports: [IdempotencyStore, IdempotencyInterceptor, RedisModule],
})
export class IdempotencyModule {}
