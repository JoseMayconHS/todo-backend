import {
	CreateUserDTO,
	UserRepositoryContract,
} from '@repositories/userRepository/UserRepository'

export class CreateUserUseCase {
	constructor(private UserRepository: UserRepositoryContract) {}

	async execute(data = {} as CreateUserDTO): Promise<string> {
		if (!data.name.length) {
			throw new Error('Nome inválido')
		}

		if (!data.email.length) {
			throw new Error('E-mail inválido')
		}

		if (!data.password.length) {
			throw new Error('Senha inválida')
		} else if (data.password.length < 6) {
			throw new Error('Senha muito curta')
		}

		const _id = await this.UserRepository.userCreate(data)

		return _id
	}
}
