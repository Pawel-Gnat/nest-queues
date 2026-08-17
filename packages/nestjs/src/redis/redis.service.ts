import { Inject, Injectable, type OnModuleDestroy } from "@nestjs/common";
import { REDIS } from "@repo/redis";
import type Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleDestroy {
	constructor(@Inject(REDIS) private readonly redis: Redis) {}

	onModuleDestroy() {
		this.redis.disconnect();
	}
}
