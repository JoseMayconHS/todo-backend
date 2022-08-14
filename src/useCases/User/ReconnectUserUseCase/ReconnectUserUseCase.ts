import { UserRepositoryContract } from '@repositories/userRepository/UserRepository'
import { LoginUserResponse } from '@useCases/User/LoginUserUseCase/LoginUserUseCase'
import { validateToken } from '@utils/validateToken'

export class ReconnectUserUseCase {
	constructor(private UserRepository: UserRepositoryContract) {}

	async execute(bearer_token = ''): Promise<LoginUserResponse> {
		validateToken(bearer_token)

		const payload = await this.UserRepository.userReconnect(bearer_token)

		return payload
	}
}
