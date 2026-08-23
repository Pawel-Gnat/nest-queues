import IORedis from "ioredis";

export const REDIS = "REDIS";

export const REDIS_URL = process.env["REDIS_URL"] ?? "redis://127.0.0.1:6380";

export function createRedis() {
	return new IORedis(REDIS_URL);
}
