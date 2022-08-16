import { UserRepositoryContract } from '@repositories/userRepository/UserRepository'

export class DeleteUserUseCase {
	constructor(private UserRepository: UserRepositoryContract) {}

	async execute(user_id = '') {
		if (!user_id) {
			throw new Error('ID inválido')
		}

		await this.UserRepository.userDelete(user_id)
	}
}
