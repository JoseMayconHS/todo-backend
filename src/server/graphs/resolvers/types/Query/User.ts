import { UserObj } from '@models/UserModel/UserModel'
import { UserRepository } from '@repositories/repositories'
import { GraphContext } from '@server/config/context'
import { PayloadOutput, SimpleOutput } from '@server/graphs/typeDefs/Users'
import { RedisService } from '@services/inMemory/redis/RedisService'
import { FindUserByIDUseCase } from '@useCases/User/FindUserByIDUseCase/FindUserByIDUseCase'
import { LoginUserUseCase } from '@useCases/User/LoginUserUseCase/LoginUserUseCase'

const redisService = new RedisService(RedisService.db.tokens)

export const UserQuery = {
	async findUserByID(_, { _id }, ctx: GraphContext): Promise<UserObj> {
		try {
			await ctx?.verifyUser()

			const userRepository = new UserRepository(ctx.db)

			const findUserByIDUseCase = new FindUserByIDUseCase(userRepository)

			const user = await findUserByIDUseCase.execute(_id)

			return user?.toObj()
		} catch (e) {
			throw new Error(e.message)
		}
	},
	async logout(_, {}, ctx: GraphContext): Promise<SimpleOutput> {
		try {
			await ctx?.verifyUser()

			ctx.revokeToken()

			return {
				ok: true,
			}
		} catch (e) {
			throw new Error(e.message)
		}
	},
	async login(_, { data }, ctx: GraphContext): Promise<PayloadOutput> {
		try {
			const userRepository = new UserRepository(ctx.db)

			const loginUserUseCase = new LoginUserUseCase(userRepository)

			const payload = await loginUserUseCase.execute(data)

			return payload
		} catch (e) {
			throw new Error(e.message)
		}
	},
	async reconnect(_, {}, ctx: GraphContext): Promise<PayloadOutput> {
		try {
			await ctx?.verifyUser()

			const userRepository = new UserRepository(ctx.db)

			const loginUserUseCase = new LoginUserUseCase(userRepository)

			const payload = await loginUserUseCase.execute(ctx.payload, true)

			ctx.revokeToken()

			return payload
		} catch (e) {
			throw new Error(e.message)
		}
	},
}
