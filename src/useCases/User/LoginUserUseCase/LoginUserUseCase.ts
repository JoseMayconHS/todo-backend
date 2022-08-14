import { UserObj } from '@models/UserModel'
import { UserRepositoryContract } from '@repositories/userRepository/UserRepository'
import { validatePassword } from '@utils/validatePassword'

export type LoginUser = {
	email: string
	password: string
}

export type LoginUserResponse = {
	data: UserObj
	token: string
}

export class LoginUserUseCase {
	constructor(private UserRepository: UserRepositoryContract) {}

	async execute(data = {} as LoginUser): Promise<LoginUserResponse | Error> {
		if (!Object.values(data).length) {
			throw new Error('Nenhuma informação para login')
		}

		if (!data.email.length) {
			throw new Error('E-mail inválido')
		}

		validatePassword(data.password)

		const payload = await this.UserRepository.userLogin(data)

		return payload
	}
}
