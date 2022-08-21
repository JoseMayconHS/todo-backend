import { Request } from 'express'

import { JWTDecoded, validateToken } from '@utils/validateToken'

import { Mongo } from '@services/db/mongo'
import { RedisService } from '@services/InMemoryService/Redis/RedisService'

export type GraphContext = {
	revokeToken(): Promise<void>
	payload: JWTDecoded
	db: Mongo
	verifyUser(): Promise<Error | void>
}

type ContextParams = {
	req: Request
}

type ContextFactoryProps = {
	db: Mongo
	redis: RedisService
}

export const contextFactory = ({
	db,
	redis,
}: ContextFactoryProps): ((props: ContextParams) => GraphContext) => {
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
			const res = await redis.getItem(
				`${RedisService.keys.tokens}:${payload.token_id}`
			)
			return !!res
		}

		return {
			payload,
			db,
			async revokeToken() {
				await redis.setItem({
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
