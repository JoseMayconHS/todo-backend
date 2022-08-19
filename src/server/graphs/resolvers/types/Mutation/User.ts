import { TContext } from '@server/config/context'
import { RegisterOutput } from '@server/graphs/typeDefs/Users'
import { UserRepository } from './../../../../../repositories/repositories'
import { CreateUserUseCase } from './../../../../../useCases/User/CreateUserUseCase/CreateUserUseCase'

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
}
