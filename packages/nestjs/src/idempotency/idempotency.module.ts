import { Module } from "@nestjs/common";
import { RedisModule } from "../redis/redis.module";
import { IdempotencyStore } from "./store/idempotency.store";

@Module({
	imports: [RedisModule],
	providers: [IdempotencyStore],
	exports: [IdempotencyStore, RedisModule],
})
export class IdempotencyModule {}
