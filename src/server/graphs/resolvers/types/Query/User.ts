import { UserObj } from '@models/UserModel/UserModel'
import { UserRepository } from '@repositories/repositories'
import { GraphContext } from '@server/config/context'
import { FindUserByIDUseCase } from '@useCases/User/FindUserByIDUseCase/FindUserByIDUseCase'

export const UserQuery = {
	async findUserByID(_, { _id }, ctx: GraphContext): Promise<UserObj> {
		try {
			ctx?.verifyUser()

			const userRepository = new UserRepository(ctx.db)

			const findUserByIDUseCase = new FindUserByIDUseCase(userRepository)

			const user = await findUserByIDUseCase.execute(_id)

			return user?.toObj()
		} catch (e) {
			throw new Error(e.message)
		}
	},
}
