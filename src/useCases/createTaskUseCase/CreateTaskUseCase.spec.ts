import { TaskRepository } from './../../repositories/repositories'
import { CreateTaskUseCase } from './CreateTaskUseCase'

describe('Create Task', () => {
	const mockTaskRepository = new TaskRepository()

	const createTaskUseCase = new CreateTaskUseCase(mockTaskRepository)

	it('should be able create task', async () => {
		const data = {
			title: 'Titulo',
			step_id: '1234',
		}
		await expect(createTaskUseCase.execute(data)).resolves.not.toThrow()
	})
	it('should not be able create task without title', async () => {
		const data = {
			title: '',
			step_id: '',
		}
		await expect(createTaskUseCase.execute(data)).rejects.toThrow()
	})
	it('should not be able create task without step_id', async () => {
		const data = {
			title: 'Title',
			step_id: '',
		}
		await expect(createTaskUseCase.execute(data)).rejects.toThrow()
	})
})
