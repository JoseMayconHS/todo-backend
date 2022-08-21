import { UserModel } from '@models/UserModel/UserModel'
import { MongoDB } from '@services/db/mongo'
import {
	LoginUser,
	LoginUserResponse,
} from '@useCases/User/LoginUserUseCase/LoginUserUseCase'

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

		if (user.errorMessage) {
			throw new Error(user.errorMessage)
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

			if (User.errorMessage) {
				throw new Error(User.errorMessage)
			}

			// @ts-ignore
			const _id = await this.db.user.insertOne(User.payload())

			// @ts-ignore
			return String(_id.insertedId)
		} else {
			throw new Error('E-mail já cadastrado')
		}
	}

	async userGetByID(user_id: string): Promise<Required<UserModel> | undefined> {
		const user = await this.db.user.findOne({
			_id: user_id,
		})

		// @ts-ignore
		return user ? new UserModel(user, user_id) : undefined
	}

	async userGetByEmail(
		email: string
	): Promise<Required<UserModel> | undefined> {
		const user = await this.db.user.findOne({
			email,
		})

		// @ts-ignore
		return user ? new UserModel(user, user._id) : undefined
	}

	async userUpdate(
		user_id: string,
		data: Partial<CreateUserDTO>
	): Promise<void> {
		if (data.password !== undefined) {
			data.password = UserModel.encrypt(data.password)
		}

		if (data.email !== undefined) {
			UserModel.validateEmail(data.email)
		}

		if (data.name !== undefined) {
			UserModel.validateName(data.name)
		}

		await this.db.user.updateOne(
			{
				_id: user_id,
			},
			{
				$set: data,
			}
		)
	}
	async userDelete(user_id: string): Promise<void> {
		await this.db.user.deleteOne({
			_id: user_id,
		})
	}
}
