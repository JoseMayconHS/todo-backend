import { UserModel } from './UserModel'

describe('UserModel', () => {
	it('should not be able create a new ID and new encrypted password', () => {
		const hash_id = 'HASH_ID'
		const hash_password = 'HASH_PASS'

		const user = new UserModel(
			{
				name: 'Maycon Silva',
				email: 'a@g.com',
				password: hash_password,
			},
			hash_id
		)

		expect(user._id).toBe(hash_id)
		expect(user.password).toBe(hash_password)
	})

	it('should be able create ID', () => {
		const user = new UserModel({
			name: 'Maycon Silva',
			email: 'a@g.com',
			password: '123456',
		})

		expect(user).toHaveProperty('_id')
	})

	// it('should not be able instantiate a User with wrong password', () => {
	// 	const password = '12345'

	// 	try {
	// 		const user = new UserModel({
	// 			name: 'Maycon Silva',
	// 			email: 'a@g.com',
	// 			password,
	// 		})
	// 	} catch (e) {
	// 		expect(e.message).toBe('Senha muito curta')
	// 	}
	// })

	it('should be able encrypt password', () => {
		const password = '123456'

		const user = new UserModel({
			name: 'Maycon Silva',
			email: 'a@g.com',
			password,
		})

		expect(user.password).not.toBe(password)
	})

	it('should be able encrypt new password', () => {
		const password = '123456'

		const user = new UserModel({
			name: 'Maycon Silva',
			email: 'a@g.com',
			password,
		})

		const new_password = '654321'

		user.setPassword(new_password)

		expect(user.comparePassword(new_password)).toBeTruthy()
	})

	it('should be able to do unsuccessful password comparison', () => {
		const clean_password = '123456'

		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: clean_password,
		})

		expect(user.comparePassword('wrong password')).not.toBeTruthy()
	})

	it('should be able to successfully do password comparison', () => {
		const clean_password = '123456'

		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: clean_password,
		})

		expect(user.comparePassword(clean_password)).toBeTruthy()
	})

	it('should ble able add workspace', () => {
		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: '123456',
		})

		expect(user.workspaces).toHaveLength(0)

		const workspace = user.addWorkspace({
			title: 'Dia-a-dia',
		})

		expect(user.workspaces).toHaveLength(1)
		expect(workspace).toHaveProperty('_id')
	})

	it('should ble able update workspace', () => {
		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: '123456',
		}) as Required<UserModel>

		const workspace = user.addWorkspace({
			title: 'Dia-a-dia',
		})

		expect(user.workspaces).toHaveLength(1)

		const data_to_update = {
			title: 'Dia-a-dia2',
			description: 'Descrição',
		}

		user.updateWorkspace(workspace._id, data_to_update)

		expect(user.workspaces[0]).toMatchObject(data_to_update)
	})

	it('should ble able delete workspace', () => {
		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: '123456',
		})

		const workspace = user.addWorkspace({
			title: 'Dia-a-dia',
		})

		expect(user.workspaces).toHaveLength(1)

		user.deleteWorkspace(workspace._id)

		expect(user.workspaces).toHaveLength(0)
	})

	it('should ble able get User as object without functions', () => {
		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: '123456',
		})

		const user_obj = user.toObj()

		expect(user_obj).not.toHaveProperty('token')
		expect(user_obj).not.toHaveProperty('setPassword')
		expect(user_obj).not.toHaveProperty('updateWorkspace')
		expect(user_obj).not.toHaveProperty('encrypt')
		expect(user_obj).not.toHaveProperty('addWorkspace')
		expect(user_obj).not.toHaveProperty('payload')
		expect(user_obj).not.toHaveProperty('comparePassword')
		expect(user_obj).not.toHaveProperty('toObj')
	})

	it('should ble able get User as object without functions but with password', () => {
		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: '123456',
		})

		const user_payload = user.payload()

		expect(user_payload).not.toHaveProperty('token')
		expect(user_payload).not.toHaveProperty('setPassword')
		expect(user_payload).not.toHaveProperty('updateWorkspace')
		expect(user_payload).not.toHaveProperty('encrypt')
		expect(user_payload).not.toHaveProperty('addWorkspace')
		expect(user_payload).not.toHaveProperty('payload')
		expect(user_payload).not.toHaveProperty('comparePassword')
		expect(user_payload).not.toHaveProperty('toObj')
		expect(user_payload).toHaveProperty('password')
	})
})
