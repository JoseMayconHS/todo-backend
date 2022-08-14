import { CreateUserUseCase } from '../CreateUserUseCase/CreateUserUseCase'
import { FindUserByIDUseCase } from '../FindUserByIDUseCase/FindUserByIDUseCase'
import { UserRepository } from './../../../repositories/repositories'
import { UpdateUserUseCase } from './UpdateUserUseCase'

describe('Update Task', () => {
	const userRepository = new UserRepository()

	const updateUserUseCase = new UpdateUserUseCase(userRepository)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const findUserByIDUseCase = new FindUserByIDUseCase(userRepository)

	it('should not be able update user without data to update', async () => {
		await expect(updateUserUseCase.execute('123', {})).rejects.toThrow()
	})

	it('should not be able update user without ID', async () => {
		await expect(updateUserUseCase.execute('', {})).rejects.toThrow()
	})

	it('should be able update user', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const new_name = 'Maycon Silva Editado'

		await updateUserUseCase.execute(user_id, { name: new_name })

		const user = await findUserByIDUseCase.execute(user_id)

		expect(user.name).toBe(new_name)
	})
	it('should not be able update encrypted password on update another user field', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const user = await findUserByIDUseCase.execute(user_id)

		const old_password = user.password

		await updateUserUseCase.execute(user_id, { name: 'Maycon Silva Editado' })

		const new_user = await findUserByIDUseCase.execute(user_id)

		expect(new_user.password).toBe(old_password)
	})
})
