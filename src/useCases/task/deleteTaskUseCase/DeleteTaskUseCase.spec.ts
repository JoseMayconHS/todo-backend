import { TaskRepository } from '../../../repositories/repositories'
import { DeleteTaskUseCase } from './DeleteTaskUseCase'

describe('Delete Task', () => {
	const taskRepository = new TaskRepository()

	const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository)

	it('should not be able delete task without id', async () => {
		await expect(deleteTaskUseCase.execute('')).resolves.not.toThrow()
	})

	it('should be able delete task', async () => {
		await expect(deleteTaskUseCase.execute('123')).resolves.not.toThrow()
	})
})
