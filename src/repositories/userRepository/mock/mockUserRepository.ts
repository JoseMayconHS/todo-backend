import { UserModel } from '@models/UserModel'

import { CreateUserDTO, UserRepositoryContract } from '../UserRepository'

export class MockUserRepository implements UserRepositoryContract {
	private users: Required<UserModel>[] = []

	async userCreate(data: CreateUserDTO): Promise<string> {
		const User = new UserModel(data as UserModel) as Required<UserModel>

		this.users.push(User)

		return User._id || ''
	}
	async userGetByID(user_id: string): Promise<Required<UserModel> | undefined> {
		const user = this.users.find((user) => user._id === user_id)

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
