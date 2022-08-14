export function validatePassword(password: string): void | Error {
	if (!password.length) {
		throw new Error('Senha inválida')
	} else if (password.length < 6) {
		throw new Error('Senha muito curta')
	}
}
