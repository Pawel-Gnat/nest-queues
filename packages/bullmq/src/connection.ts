import { REDIS_URL } from "@repo/redis";
import type { RedisOptions } from "ioredis";

export function getBullmqConnectionOptions(): RedisOptions {
	const url = new URL(REDIS_URL);

	return {
		host: url.hostname,
		port: Number(url.port || 6379),
		username: url.username || undefined,
		password: url.password || undefined,
		maxRetriesPerRequest: null,
	};
}
