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

	it('should ble able add step in workspace', () => {
		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: '123456',
		}) as Required<UserModel>

		const workspace = user.addWorkspace({
			title: 'Dia-a-dia',
		})

		expect(user.workspaces[0].steps).toHaveLength(3)

		const data = {
			label: 'Analisar código',
			index: 0,
		}

		const step = user.addStepToWorkspace(workspace._id, data)

		expect(user.workspaces[0].steps).toContain(step)
	})

	it('should ble able update step in workspace', () => {
		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: '123456',
		}) as Required<UserModel>

		const workspace = user.addWorkspace({
			title: 'Dia-a-dia',
		})

		const data = {
			label: 'Analisar código',
			index: 0,
		}

		const step = user.addStepToWorkspace(workspace._id, data)

		const new_label = 'Revisar código'

		user.updateStepInWorkspace(step._id, workspace._id, {
			label: new_label,
		})

		expect(user.workspaces[0].steps).toContainEqual({
			...step,
			label: new_label,
		})
	})

	it('should ble able delete step in workspace', () => {
		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: '123456',
		}) as Required<UserModel>

		const workspace = user.addWorkspace({
			title: 'Dia-a-dia',
		})

		const data = {
			label: 'Analisar código',
			index: 0,
		}

		const step = user.addStepToWorkspace(workspace._id, data)

		expect(user.workspaces[0].steps).toHaveLength(4)

		user.deleteStepInWorkspace(step._id, workspace._id)

		expect(user.workspaces[0].steps).toHaveLength(3)
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

	it('should ble able add task', () => {
		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: '123456',
		}) as Required<UserModel>

		const workspace = user.addWorkspace({
			title: 'Dia-a-dia',
		})

		expect(user.workspaces[0].tasks).toHaveLength(0)

		user.addTask(workspace._id, {
			title: 'Fazer café',
			step_id: '12',
		})

		expect(user.workspaces[0].tasks).toHaveLength(1)
	})

	it('should ble able update task', () => {
		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: '123456',
		}) as Required<UserModel>

		const workspace = user.addWorkspace({
			title: 'Dia-a-dia',
		})

		expect(user.workspaces[0].tasks).toHaveLength(0)

		const task = user.addTask(workspace._id, {
			title: 'Fazer café',
			step_id: '12',
		})

		expect(user.workspaces[0].tasks).toHaveLength(1)

		const new_title = 'Fazer achocolatado'

		const data_to_update = {
			title: new_title,
		}

		user.updateTask(task._id, workspace._id, data_to_update)

		expect(user.workspaces[0].tasks[0].title).toBe(new_title)
	})

	it('should ble able delete task', () => {
		const user = new UserModel({
			name: 'Maycon',
			email: 'a@g.com',
			password: '123456',
		}) as Required<UserModel>

		const workspace = user.addWorkspace({
			title: 'Dia-a-dia',
		})

		expect(user.workspaces[0].tasks).toHaveLength(0)

		const task = user.addTask(workspace._id, {
			title: 'Fazer café',
			step_id: '12',
		})

		expect(user.workspaces[0].tasks).toHaveLength(1)

		user.deleteTask(task._id, workspace._id)

		expect(user.workspaces[0].tasks).toHaveLength(0)
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

		expect(user_obj).not.toHaveProperty('addWorkspace')
		expect(user_obj).not.toHaveProperty('updateWorkspace')
		expect(user_obj).not.toHaveProperty('deleteWorkspace')

		expect(user_obj).not.toHaveProperty('addTask')
		expect(user_obj).not.toHaveProperty('updateTask')
		expect(user_obj).not.toHaveProperty('deleteTask')

		expect(user_obj).not.toHaveProperty('addStepToWorkspace')
		expect(user_obj).not.toHaveProperty('updateStepInWorkspace')
		expect(user_obj).not.toHaveProperty('deleteStepInWorkspace')

		expect(user_obj).not.toHaveProperty('encrypt')
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

		expect(user_payload).not.toHaveProperty('addWorkspace')
		expect(user_payload).not.toHaveProperty('updateWorkspace')
		expect(user_payload).not.toHaveProperty('deleteWorkspace')

		expect(user_payload).not.toHaveProperty('addTask')
		expect(user_payload).not.toHaveProperty('updateTask')
		expect(user_payload).not.toHaveProperty('deleteTask')

		expect(user_payload).not.toHaveProperty('addStepToWorkspace')
		expect(user_payload).not.toHaveProperty('updateStepInWorkspace')
		expect(user_payload).not.toHaveProperty('deleteStepInWorkspace')

		expect(user_payload).not.toHaveProperty('encrypt')
		expect(user_payload).not.toHaveProperty('payload')
		expect(user_payload).not.toHaveProperty('comparePassword')
		expect(user_payload).not.toHaveProperty('toObj')
		expect(user_payload).toHaveProperty('password')
	})
})
