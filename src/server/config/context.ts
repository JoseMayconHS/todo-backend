import { JWTDecoded, validateToken } from '@utils/validateToken'
import { Request } from 'express'

import { MongoDB } from '@services/db/mongo'

type Filter = {
	_id?: string
	email?: string
}

export type TContext = {
	payload: JWTDecoded
	db: MongoDB
	verifyUser(): Error | void
	verifyMySelf(props: Filter): Error | void
}

type ContextParams = {
	req: Request
}

export const contextFactory = (
	db: MongoDB
): ((props: ContextParams) => TContext) => {
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

		return {
			payload,
			db,
			verifyUser() {
				if (!payload) throw err
			},
			verifyMySelf(filter) {
				if (!payload) throw err

				if (!filter) throw err

				const { _id, email } = filter

				if (!_id && !email) throw err

				if (_id && payload._id !== _id) throw err
				if (email && payload.email !== email) throw err
			},
		}
	}
}
