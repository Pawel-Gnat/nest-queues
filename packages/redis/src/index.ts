import Redis from "ioredis";

export const REDIS = "REDIS";

export const REDIS_URL = process.env["REDIS_URL"] ?? "redis://127.0.0.1:6379";

export function createRedis() {
	return new Redis(REDIS_URL);
}
