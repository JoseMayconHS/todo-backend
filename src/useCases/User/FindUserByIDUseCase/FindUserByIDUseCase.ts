import { UserModel } from '@models/UserModel/UserModel'
import { UserRepositoryContract } from '@repositories/userRepository/UserRepository'

export class FindUserByIDUseCase {
	constructor(private UserRepository: UserRepositoryContract) {}

	async execute(user_id = ''): Promise<UserModel> {
		if (!user_id) {
			throw new Error('ID do usuário inválido')
		}

		const user = await this.UserRepository.userGetByID(user_id)

		return user
	}
}
