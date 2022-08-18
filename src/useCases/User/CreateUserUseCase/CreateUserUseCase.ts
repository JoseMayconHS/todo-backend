import {
	CreateUserDTO,
	UserRepositoryContract,
} from '@repositories/userRepository/UserRepository'

export class CreateUserUseCase {
	constructor(private UserRepository: UserRepositoryContract) {}

	async execute(data = {} as CreateUserDTO): Promise<string> {
		const _id = await this.UserRepository.userCreate(data)

		return _id
	}
}
