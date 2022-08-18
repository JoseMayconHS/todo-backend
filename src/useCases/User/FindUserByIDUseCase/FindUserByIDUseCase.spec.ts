import { UserRepository } from '../../../repositories/repositories'
import { CreateUserUseCase } from '../CreateUserUseCase/CreateUserUseCase'
import { DeleteUserUseCase } from './../DeleteUserUseCase/DeleteUserUseCase'
import { FindUserByIDUseCase } from './FindUserByIDUseCase'

describe('Find user by ID', () => {
	const userRepository = new UserRepository()

	const findUserByIDUseCase = new FindUserByIDUseCase(userRepository)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const deleteUserUseCase = new DeleteUserUseCase(userRepository)

	let user_id

	afterEach(async () => {
		try {
			await deleteUserUseCase.execute(user_id)
		} catch (e) {}
	})

	it('should not be able find user without ID', async () => {
		await expect(findUserByIDUseCase.execute('')).rejects.toThrow()
	})

	it('should be able find user by ID', async () => {
		user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const user = await findUserByIDUseCase.execute(user_id)

		expect(user._id).toBe(user_id)
	})

	it('should be able get user token', async () => {
		user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const user = await findUserByIDUseCase.execute(user_id)

		expect(user.token()).toBeDefined()
	})
})
