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
		const task = new TaskModel({
			title: 'Fazer café',
			step_id: '1',
		})

		expect(task).toHaveProperty('_id')
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

	it('should be able add item in checklist', () => {
		const title = 'Dia-a-dia'
		const step_id = '123'

		const task = new TaskModel({
			title,
			step_id,
		})

		expect(task.checklist).toHaveLength(0)

		const checklist = task.addChecklist({
			description: 'Acordar',
		})

		expect(task.checklist).toHaveLength(1)
		expect(task.checklist[0]._id).toBe(checklist._id)
	})

	it('should be able update item in checklist', () => {
		const title = 'Dia-a-dia'
		const step_id = '123'

		const task = new TaskModel({
			title,
			step_id,
		})

		const description = 'Acordar'

		const checklist = task.addChecklist({
			description,
		})

		expect(task.checklist[0].description).toBe(description)

		const new_description = 'Levantar'

		task.updateChecklist(checklist._id, {
			description: new_description,
		})

		expect(task.checklist[0].description).toBe(new_description)
	})

	it('should be able delete item in checklist', () => {
		const title = 'Dia-a-dia'
		const step_id = '123'

		const task = new TaskModel({
			title,
			step_id,
		})

		expect(task.checklist).toHaveLength(0)

		const checklist = task.addChecklist({
			description: 'Acordar',
		})

		expect(task.checklist).toHaveLength(1)

		task.deleteChecklist(checklist._id)

		expect(task.checklist).toHaveLength(0)
	})

	it('should be able add member_id', () => {
		const title = 'Dia-a-dia'
		const step_id = '123'

		const task = new TaskModel({
			title,
			step_id,
		})

		expect(task.members_id).toHaveLength(0)

		task.addMember('123')

		expect(task.members_id).toHaveLength(1)
	})

	it('should be able delete member_id', () => {
		const title = 'Dia-a-dia'
		const step_id = '123'

		const task = new TaskModel({
			title,
			step_id,
		})

		expect(task.members_id).toHaveLength(0)

		task.addMember('123')

		expect(task.members_id).toHaveLength(1)

		task.deleteMember('123')

		expect(task.members_id).toHaveLength(0)
	})
})
