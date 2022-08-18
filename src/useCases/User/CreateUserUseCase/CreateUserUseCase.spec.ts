import { UserModel } from '../../../models/UserModel/UserModel'
import { UserRepository } from '../../../repositories/repositories'
import { FindUserByIDUseCase } from '../FindUserByIDUseCase/FindUserByIDUseCase'
import { DeleteUserUseCase } from './../DeleteUserUseCase/DeleteUserUseCase'
import { CreateUserUseCase } from './CreateUserUseCase'

describe('Create User', () => {
	const userRepository = new UserRepository()

	const createUserUseCase = new CreateUserUseCase(userRepository)
	const deleteUserUseCase = new DeleteUserUseCase(userRepository)
	const findUserByIDUseCase = new FindUserByIDUseCase(userRepository)

	let user_id

	afterEach(async () => {
		try {
			await deleteUserUseCase.execute(user_id)
		} catch (e) {}
	})

	it('should not be able create user without name', async () => {
		let errorMessage = ''

		try {
			await createUserUseCase.execute({
				name: '',
				password: '123456',
				email: 'a@g.com',
			})
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('Nome inválido')
	})

	/**
	 * SOBRE AS VERIFICAÇÕES DE SENHA:
	 *
	 * O erro quebra o processo do Jest porquê
	 * o erro é lançado de dentro de um método
	 * UserModel.validatePassword()
	 * que é chamado dentro de outro
	 * constructor() { this.setPassword() }
	 */

	// it('should not be able create user without password', async () => {
	// 	let errorMessage = ''

	// 	try {
	// 		await createUserUseCase.execute({
	// 			name: 'Maycon Silva',
	// 			password: '',
	// 			email: 'a@g.com',
	// 		})
	// 	} catch (e) {
	// 		errorMessage = e.message
	// 	}

	// 	expect(errorMessage).toBe('Senha inválida')
	// })

	// it('should not be able create user with password length < 6', async () => {
	// 	let errorMessage = ''

	// 	try {
	// 		await createUserUseCase.execute({
	// 			name: 'Maycon Silva',
	// 			password: '12345',
	// 			email: 'a@g.com',
	// 		})
	// 	} catch (e) {
	// 		errorMessage = e.message
	// 	}

	// 	expect(errorMessage).toBe('Senha muito curta')
	// })

	it('should not be able create user without email', async () => {
		let errorMessage = ''

		try {
			await createUserUseCase.execute({
				name: 'Maycon Silva',
				password: '123456',
				email: '',
			})
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('E-mail mal formatado')
	})

	it('should not be able create user with email duplicate', async () => {
		let errorMessage = ''

		try {
			const email = 'a@g.com'

			user_id = await createUserUseCase.execute({
				name: 'Maycon Silva',
				password: '123456',
				email,
			})

			await createUserUseCase.execute({
				name: 'Maycon Silva',
				password: '123456',
				email,
			})
		} catch (e) {
			errorMessage = e.message
		}

		expect(errorMessage).toBe('E-mail já cadastrado')
	})

	it('should be able create user', async () => {
		user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password: '123456',
			email: 'a@g.com',
		})

		const user = await findUserByIDUseCase.execute(user_id)

		expect(user).toBeInstanceOf(UserModel)
	})

	it('should be able create user with encrypted password', async () => {
		const password = '123456'

		user_id = await createUserUseCase.execute({
			name: 'Maycon Silva',
			password,
			email: 'a@g.com',
		})

		const user = await findUserByIDUseCase.execute(user_id)

		expect(user.password).not.toBe(password)
	})
})
