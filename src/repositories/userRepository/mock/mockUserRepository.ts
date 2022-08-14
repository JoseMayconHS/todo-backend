import { UserModel } from '@models/UserModel'
import {
	LoginUser,
	LoginUserResponse,
} from '@useCases/User/LoginUserUseCase/LoginUserUseCase'

import { CreateUserDTO, UserRepositoryContract } from '../UserRepository'

export class MockUserRepository implements UserRepositoryContract {
	private users: Required<UserModel>[] = []

	async userLogin(data: LoginUser): Promise<LoginUserResponse | Error> {
		const { email, password } = data

		const user = await this.userGetByEmail(email)

		if (!user) {
			throw new Error('Não existe usuário com este e-mail')
		}

		// (STAND BY) comparar senhas

		return {
			data: user.toObj(),
			token: await user.token(),
		}
	}

	async userCreate(data: CreateUserDTO): Promise<string> {
		const User = new UserModel(data as UserModel) as Required<UserModel>

		this.users.push(User)

		return User._id
	}

	async userGetByID(user_id: string): Promise<Required<UserModel> | undefined> {
		const user = this.users.find((user) => user._id === user_id)

		return user
	}

	async userGetByEmail(
		email: string
	): Promise<Required<UserModel> | undefined> {
		const user = this.users.find((user) => user.email === email)

		return user
	}

	async userUpdate(
		user_id: string,
		data: Partial<CreateUserDTO>
	): Promise<void> {
		const index = this.users.findIndex((user) => user._id === user_id)

		if (index !== -1) {
			const newUser = new UserModel(
				{
					...this.users[index],
					...data,
				},
				user_id
			) as Required<UserModel>

			this.users.splice(index, 1, newUser)
		}
	}
	async userDelete(user_id: string): Promise<void> {
		const index = this.users.findIndex((user) => user._id === user_id)

		if (index !== -1) {
			this.users.splice(index, 1)
		}
	}
}
