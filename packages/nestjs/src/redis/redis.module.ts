import { Logger, Module } from "@nestjs/common";
import { createRedis, REDIS, REDIS_URL } from "@repo/redis";
import type Redis from "ioredis";
import { RedisService } from "./redis.service";

function createLoggedRedis(): Redis {
	const redis = createRedis();
	const logger = new Logger("Redis");

	redis.on("error", (error: Error) => {
		logger.error(error.message);
	});
	redis.on("reconnecting", () => {
		logger.warn(`reconnecting ${REDIS_URL}`);
	});
	redis.on("ready", () => {
		logger.log(`connected ${REDIS_URL}`);
	});

	return redis;
}

@Module({
	providers: [{ provide: REDIS, useFactory: createLoggedRedis }, RedisService],
	exports: [REDIS],
})
export class RedisModule {}
