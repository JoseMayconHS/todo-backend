import { UserRepository } from '../../../repositories/repositories'
import { CreateUserUseCase } from '../CreateUserUseCase/CreateUserUseCase'
import { FindUserByIDUseCase } from '../FindUserByIDUseCase/FindUserByIDUseCase'
import { LoginUserUseCase } from '../LoginUserUseCase/LoginUserUseCase'
import { ReconnectUserUseCase } from './ReconnectUserUseCase'

describe('Login User', () => {
	const userRepository = new UserRepository()

	const reconnectUserUseCase = new ReconnectUserUseCase(userRepository)
	const createUserUseCase = new CreateUserUseCase(userRepository)
	const loginUserUseCase = new LoginUserUseCase(userRepository)
	const findUserByIDUseCase = new FindUserByIDUseCase(userRepository)

	it('should not be able reconnect without bearer_token', async () => {
		await expect(reconnectUserUseCase.execute()).rejects.toThrow()
	})
	it('should not be able reconnect with bad formatted bearer_token', async () => {
		await expect(reconnectUserUseCase.execute('Bea 12345')).rejects.toThrow()
	})

	it('should not be able reconnect with invalid bearer_token', async () => {
		await expect(reconnectUserUseCase.execute('Bearer 123')).rejects.toThrow()
	})

	it('should be able reconnect user', async () => {
		const login_data = {
			password: '123456',
			email: 'a1@g.com',
		}

		const user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			...login_data,
		})

		const payload = await loginUserUseCase.execute(login_data)

		const payload_reconnected = await reconnectUserUseCase.execute(
			payload.token
		)

		expect(payload_reconnected).toBeDefined()
		expect(payload_reconnected.data._id).toBe(user_id)
		expect(payload_reconnected.token).not.toBe(payload.token)
	})
})
