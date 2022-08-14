import {
	CreateUserDTO,
	UserRepositoryContract,
} from '@repositories/userRepository/UserRepository'
import { validatePassword } from '@utils/validatePassword'

export class CreateUserUseCase {
	constructor(private UserRepository: UserRepositoryContract) {}

	async execute(data = {} as CreateUserDTO): Promise<string> {
		if (!data.name.length) {
			throw new Error('Nome inválido')
		}

		if (!data.email.length) {
			throw new Error('E-mail inválido')
		}

		validatePassword(data.password)

		const _id = await this.UserRepository.userCreate(data)

		return _id
	}
}
