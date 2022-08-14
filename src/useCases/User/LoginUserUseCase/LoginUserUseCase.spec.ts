import { UserRepository } from '../../../repositories/repositories'
import { CreateUserUseCase } from './../CreateUserUseCase/CreateUserUseCase'
import { LoginUserUseCase } from './LoginUserUseCase'

describe('Login User', () => {
	const userRepository = new UserRepository()

	const loginUserUseCase = new LoginUserUseCase(userRepository)
	const createUserUseCase = new CreateUserUseCase(userRepository)

	it('should not be able login without data to update', async () => {
		await expect(loginUserUseCase.execute()).rejects.toThrow()
	})
	it('should not be able login without email', async () => {
		await expect(
			loginUserUseCase.execute({
				password: '123456',
				email: '',
			})
		).rejects.toThrow()
	})

	it('should not be able login without password', async () => {
		await expect(
			loginUserUseCase.execute({
				password: '',
				email: 'a@g.com',
			})
		).rejects.toThrow()
	})

	it('should not be able login with password length < 6', async () => {
		await expect(
			loginUserUseCase.execute({
				password: '12345',
				email: 'a@g.com',
			})
		).rejects.toThrow()
	})

	it('should not be able find user with wrong email', async () => {
		await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		await expect(
			loginUserUseCase.execute({
				password: '123456',
				email: 'b@g.com',
			})
		).rejects.toThrow()
	})

	it('should not be able find user with wrong password', async () => {
		await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		await expect(
			loginUserUseCase.execute({
				password: '123455',
				email: 'a@g.com',
			})
		).resolves.not.toThrow()
	})

	it('should be able login', async () => {
		await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const payload = await loginUserUseCase.execute({
			password: '123456',
			email: 'a@g.com',
		})

		expect(payload).not.toBe(undefined)
		expect(payload.token).not.toBe(undefined)
		expect(payload.data).not.toBe(undefined)
	})
})
