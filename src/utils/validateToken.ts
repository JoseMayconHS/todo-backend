import { UserPayload } from '@models/UserModel'
import jsonwebtoken from 'jsonwebtoken'

export function validateToken(token: string): UserPayload {
	const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET)

	if (!decoded) {
		throw new Error('Token expirado')
	}

	return decoded as UserPayload
}
