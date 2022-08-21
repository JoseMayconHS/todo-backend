import { UserModel, UserObj } from '@models/UserModel/UserModel'
import { UserRepositoryContract } from '@repositories/userRepository/UserRepository'

export type LoginUser = {
	email: string
	password?: string
}

export type LoginUserResponse = {
	data: UserObj
	token: string
}

export class LoginUserUseCase {
	constructor(private UserRepository: UserRepositoryContract) {}

	async execute(
		data = {} as LoginUser,
		reconnect?: boolean
	): Promise<LoginUserResponse> {
		if (!Object.values(data).length) {
			throw new Error('Nenhuma informação para login')
		}

		UserModel.validateEmail(data.email)

		UserModel.validatePassword(data.password)

		const payload = await this.UserRepository.userLogin(data, reconnect)

		return payload
	}
}
