import dotenv from 'dotenv'
import Redis, { RedisOptions } from 'ioredis'

import { InMemoryService, SetItemData } from '../InMemoryService'

dotenv.config()

export const redisConfig: RedisOptions = {
	host: process.env.REDIS_HOST,
	port: +process.env.REDIS_PORT,
	username: process.env.REDIS_USER,
	password: process.env.REDIS_PASS,
}

export class RedisService implements InMemoryService {
	#redisClient: Redis

	static keys = { tokens: 'revoked_tokens' }
	static db = { tokens: 1 }

	constructor(db: number) {
		this.#redisClient = new Redis({
			...redisConfig,
			db,
		})

		this.#redisClient.on('connect', () => console.log('Redis Client Connected'))
		this.#redisClient.on('end', () => console.log('Redis Client Disconnected'))
		this.#redisClient.on('reconnecting', () =>
			console.log('Redis Client Reconnecting')
		)
		this.#redisClient.on('error', (err) =>
			console.log('Redis Client Error', err)
		)
	}

	async setItem(data: SetItemData): Promise<void> {
		const { key, value } = data

		await this.#redisClient.set(key, value)
	}

	async getItem(key: string): Promise<string> {
		const item = await this.#redisClient.get(key)

		return item
	}

	async delItem(key: string): Promise<void> {
		await this.#redisClient.del(key)
	}

	async delAll(keyPattern: string): Promise<void> {
		const keys = await this.#redisClient.keys(`${keyPattern}*`)

		await this.#redisClient.del(keys)
	}
}
