import { Module } from "@nestjs/common";
import { createRedis, REDIS } from "@repo/redis";
import { RedisService } from "./redis.service";

@Module({
	providers: [{ provide: REDIS, useFactory: createRedis }, RedisService],
	exports: [REDIS],
})
export class RedisModule {}
