import { UserPayload } from '@models/UserModel/UserModel'
import jsonwebtoken from 'jsonwebtoken'

export function validateToken(bearer_token: string): UserPayload {
	const [bearer, hash] = bearer_token.split(' ')

	if (!/^Bearer$/.test(bearer) || !hash) {
		throw new Error('Token mal formatado')
	}

	try {
		const decoded = jsonwebtoken.verify(hash, process.env.JWT_SECRET)

		return decoded as UserPayload
	} catch (e) {
		throw new Error('Token inválido')
	}
}
