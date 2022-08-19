import { UserModel } from '@models/UserModel/UserModel'
import { MongoDB } from '@services/db/mongo'
import {
	LoginUser,
	LoginUserResponse,
} from '@useCases/User/LoginUserUseCase/LoginUserUseCase'
import { validateToken } from '@utils/validateToken'

import { CreateUserDTO, UserRepositoryContract } from '../UserRepository'

export class MongoUserRepository implements UserRepositoryContract {
	public users: Required<UserModel>[] = []

	constructor(private db: MongoDB) {}

	async userLogin(
		data: LoginUser,
		reconnect?: boolean
	): Promise<LoginUserResponse> {
		const { email, password } = data

		const user = await this.userGetByEmail(email)

		if (!user) {
			throw new Error('Não existe usuário com este e-mail')
		}

		if (
			(!reconnect && !user.comparePassword(password)) ||
			(reconnect && password !== user.password)
		) {
			throw new Error('Senha incorreta')
		}

		return {
			data: user.toObj(),
			token: user.token(),
		}
	}

	async userReconnect(bearer_token: string): Promise<LoginUserResponse> {
		const decoded = validateToken(bearer_token)

		const { email, password } = decoded

		const payload = await this.userLogin({ email, password }, true)

		return payload
	}

	async userCreate(data: CreateUserDTO): Promise<string> {
		const userAlreadyExist = await this.db.user.findOne(
			{
				email: data.email,
			},
			{
				projection: {
					_id: 1,
				},
			}
		)

		if (!userAlreadyExist) {
			const User = new UserModel(data as UserModel) as Required<UserModel>

			// @ts-ignore
			const _id = await this.db.user.insertOne(User.payload())

			// @ts-ignore
			return String(_id.insertedId)
		} else {
			throw new Error('E-mail já cadastrado')
		}
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

			data.password && newUser.encrypt()

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
