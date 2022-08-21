import { Request } from 'express'

import { JWTDecoded, validateToken } from '@utils/validateToken'

import { Mongo } from '@services/db/mongo'
import { RedisService } from '@services/inMemory/redis/RedisService'

type Filter = {
	_id?: string
	email?: string
}

export type GraphContext = {
	revokeToken(): Promise<void>
	payload: JWTDecoded
	db: Mongo
	verifyUser(): Promise<Error | void>
}

const redisService = new RedisService(RedisService.db.tokens)

type ContextParams = {
	req: Request
}

export const contextFactory = (
	db: Mongo
): ((props: ContextParams) => GraphContext) => {
	return ({ req }) => {
		const auth = req.headers.authorization ?? ''

		let payload: JWTDecoded

		if (auth) {
			try {
				payload = validateToken(auth)
			} catch (e) {
				console.log(e.message)
			}
		}

		const err = new Error('Acesso negado!')

		const verifyTokenInBlackList = async () => {
			const res = await redisService.getItem(
				`${RedisService.keys.tokens}:${payload.token_id}`
			)
			return !!res
		}

		return {
			payload,
			db,
			async revokeToken() {
				await redisService.setItem({
					key: `${RedisService.keys.tokens}:${payload.token_id}`,
					value: auth,
				})
			},
			async verifyUser() {
				if (!payload) throw err

				if (await verifyTokenInBlackList()) {
					throw err
				}
			},
		}
	}
}
