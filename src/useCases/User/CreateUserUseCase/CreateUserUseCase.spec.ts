import { UserRepository } from '../../../repositories/repositories'
import { FindUserByIDUseCase } from '../FindUserByIDUseCase/FindUserByIDUseCase'
import { CreateUserUseCase } from './CreateUserUseCase'

describe('Create User', () => {
	const userRepository = new UserRepository()

	const createUserUseCase = new CreateUserUseCase(userRepository)
	const findUserByIDUseCase = new FindUserByIDUseCase(userRepository)

	it('should not be able create user without name', async () => {
		await expect(
			createUserUseCase.execute({
				name: '',
				password: '123456',
				email: 'a@g.com',
			})
		).rejects.toThrow()
	})

	it('should not be able create user without password', async () => {
		await expect(
			createUserUseCase.execute({
				name: 'Maycon Silva',
				password: '',
				email: 'a@g.com',
			})
		).rejects.toThrow()
	})

	it('should not be able create user without email', async () => {
		await expect(
			createUserUseCase.execute({
				name: 'Maycon Silva',
				password: '123456',
				email: '',
			})
		).rejects.toThrow()
	})

	it('should not be able create user with password length < 6', async () => {
		await expect(
			createUserUseCase.execute({
				name: 'Maycon Silva',
				password: '12345',
				email: 'a@g.com',
			})
		).rejects.toThrow()
	})

	it('should be able create user', async () => {
		await expect(
			createUserUseCase.execute({
				name: 'Maycon Silva',
				password: '123456',
				email: 'a@g.com',
			})
		).resolves.not.toThrow()
	})

	it('should be able create user with encrypted password', async () => {
		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const user = await findUserByIDUseCase.execute(user_id)

		expect(user.password).toBe('Senha encriptada')
	})
})
