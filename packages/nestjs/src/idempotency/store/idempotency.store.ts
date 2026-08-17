import { Inject, Injectable } from "@nestjs/common";
import { REDIS } from "@repo/redis";
import type Redis from "ioredis";

const TTL_SECONDS = 60 * 60 * 24;

@Injectable()
export class IdempotencyStore {
	constructor(@Inject(REDIS) private readonly redis: Redis) {}

	private key(pattern: string, id: string) {
		return `idempotency:${pattern}:${id}`;
	}

	async get<T = unknown>(pattern: string, id: string): Promise<T | null> {
		const raw = await this.redis.get(this.key(pattern, id));
		if (raw == null) {
			return null;
		}

		return JSON.parse(raw) as T;
	}

	async claim(pattern: string, id: string, result: unknown) {
		const wrote = await this.redis.set(
			this.key(pattern, id),
			JSON.stringify(result),
			"EX",
			TTL_SECONDS,
			"NX",
		);

		return wrote === "OK";
	}
}
