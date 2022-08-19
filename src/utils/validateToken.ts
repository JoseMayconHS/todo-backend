import jsonwebtoken from 'jsonwebtoken'

export type JWTDecoded = {
	_id: string
	email: string
	password: string
	token_id: string
}

export function validateToken(bearer_token: string): JWTDecoded {
	const [bearer, hash] = bearer_token.split(' ')

	if (!/^Bearer$/.test(bearer) || !hash) {
		throw new Error('Token mal formatado')
	}

	try {
		const decoded = jsonwebtoken.verify(hash, process.env.JWT_SECRET)

		return decoded as JWTDecoded
	} catch (e) {
		throw new Error('Token inválido')
	}
}
