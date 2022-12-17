import { MockUserRepository } from '../../../repositories/userRepository/mock/mockUserRepository'
import { CreateUserUseCase } from '../CreateUserUseCase/CreateUserUseCase'
import { FindUserByIDUseCase } from '../FindUserByIDUseCase/FindUserByIDUseCase'
import { DeleteUserUseCase } from './DeleteUserUseCase'

describe('Delete User', () => {
	const userRepository = new MockUserRepository()

	const deleteUserUseCase = new DeleteUserUseCase(userRepository)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const findUserByIDUseCase = new FindUserByIDUseCase(userRepository)

	it('should not be able delete user without id', async () => {
		await expect(deleteUserUseCase.execute('')).rejects.toThrow()
	})

	it('should be able delete user', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		await deleteUserUseCase.execute(user_id)

		const user = await findUserByIDUseCase.execute(user_id)

		expect(user).toBe(undefined)
	})
})
