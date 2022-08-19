import { UserRepository } from '@repositories/repositories'
import { TContext } from '@server/config/context'
import {
	LoginOutput,
	RegisterOutput,
	SimpleOutput,
} from '@server/graphs/typeDefs/Users'
import { CreateUserUseCase } from '@useCases/User/CreateUserUseCase/CreateUserUseCase'
import { LoginUserUseCase } from '@useCases/User/LoginUserUseCase/LoginUserUseCase'
import { DeleteUserUseCase } from './../../../../../useCases/User/DeleteUserUseCase/DeleteUserUseCase'
import { UpdateUserUseCase } from './../../../../../useCases/User/UpdateUserUseCase/UpdateUserUseCase'

export const UserMutation = {
	async register(_, { data }, ctx: TContext): Promise<RegisterOutput> {
		try {
			const userRepository = new UserRepository(ctx.db)

			const createUserUseCase = new CreateUserUseCase(userRepository)

			const _id = await createUserUseCase.execute(data)

			return {
				ok: true,
				_id,
				message: 'Usuário criado com sucesso',
			}
		} catch (e) {
			return {
				ok: false,
				message: e.message,
			}
		}
	},
	async login(_, { data }, ctx: TContext): Promise<LoginOutput> {
		try {
			const userRepository = new UserRepository(ctx.db)

			const loginUserUseCase = new LoginUserUseCase(userRepository)

			const payload = await loginUserUseCase.execute(data)

			return payload
		} catch (e) {
			throw new Error(e.message)
		}
	},
	async removeUser(_, {}, ctx: TContext): Promise<SimpleOutput> {
		try {
			const userRepository = new UserRepository(ctx.db)

			const deleteUserUseCase = new DeleteUserUseCase(userRepository)

			await deleteUserUseCase.execute(ctx.payload._id)

			return {
				ok: true,
			}
		} catch (e) {
			throw new Error(e.message)
		}
	},
	async updateUser(_, { data }, ctx: TContext): Promise<SimpleOutput> {
		try {
			const userRepository = new UserRepository(ctx.db)

			const updateUserUseCase = new UpdateUserUseCase(userRepository)

			await updateUserUseCase.execute(ctx.payload._id, data)

			return {
				ok: true,
			}
		} catch (e) {
			throw new Error(e.message)
		}
	},
}
