import { UserRepositoryContract } from '@repositories/userRepository/UserRepository'

export class UpdateUserUseCase {
	constructor(private UserRepository: UserRepositoryContract) {}

	async execute(user_id = '', data = {}) {
		if (!user_id) {
			throw new Error('ID inválido')
		}

		if (!Object.values(data).length) {
			throw new Error('Nenhuma informação para atualizar')
		}

		await this.UserRepository.userUpdate(user_id, data)
	}
}
