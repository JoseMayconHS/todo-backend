import { UserRepository } from '../../../repositories/repositories'
import { CreateUserUseCase } from '../CreateUserUseCase/CreateUserUseCase'
import { FindUserByIDUseCase } from './FindUserByIDUseCase'

describe('Find user by ID', () => {
	const userRepository = new UserRepository()

	const findUserByIDUseCase = new FindUserByIDUseCase(userRepository)
	const createUserUseCase = new CreateUserUseCase(userRepository)

	it('should not be able find user without ID', async () => {
		await expect(findUserByIDUseCase.execute('')).rejects.toThrow()
	})

	it('should be able find user by ID', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const user = await findUserByIDUseCase.execute(user_id)
		expect(user._id).toBe(user_id)
	})

	it('should be able get user token', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const user = await findUserByIDUseCase.execute(user_id)

		expect(await user.token()).toBe(`Token do usuário ${user_id}`)
	})
})
