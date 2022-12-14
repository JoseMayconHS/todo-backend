import { MockUserRepository } from '../../../repositories/userRepository/mock/mockUserRepository'
import { CreateUserUseCase } from '../CreateUserUseCase/CreateUserUseCase'
import { DeleteUserUseCase } from './../DeleteUserUseCase/DeleteUserUseCase'
import { LoginUserUseCase } from './LoginUserUseCase'

describe('Login User', () => {
	const userRepository = new MockUserRepository()

	const loginUserUseCase = new LoginUserUseCase(userRepository)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const deleteUserUseCase = new DeleteUserUseCase(userRepository)

	let user_id

	afterEach(async () => {
		try {
			await deleteUserUseCase.execute(user_id)
		} catch (e) {}
	})

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
		user_id = await createUserUseCase.execute({
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
		user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		await expect(
			loginUserUseCase.execute({
				password: '123455',
				email: 'a@g.com',
			})
		).rejects.toThrow()
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
		expect(payload.token).toBeDefined()
		expect(payload.data).toBeDefined()
	})
})
