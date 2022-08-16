import { TaskModel } from './TaskModel'

describe('TaskModel', () => {
	it('should not be able create a new ID', () => {
		const hash_id = 'HASH_ID'

		const task = new TaskModel(
			{
				title: 'Fazer café',
				step_id: '1',
			},
			hash_id
		)

		expect(task._id).toBe(hash_id)
	})

	it('should be able create ID', () => {
		const user = new TaskModel({
			title: 'Fazer café',
			step_id: '1',
		})

		expect(user).toHaveProperty('_id')
	})

	it('should be able create task', () => {
		const title = 'Dia-a-dia'
		const step_id = '123'

		const task = new TaskModel({
			title,
			step_id,
		})

		expect(task).toHaveProperty('title', title)
		expect(task).toHaveProperty('step_id', step_id)
		expect(task).toHaveProperty('description', '')
		expect(task).toHaveProperty('doneAt')
		expect(task.members_id).toHaveLength(0)
		expect(task.checklist).toHaveLength(0)
	})
})
