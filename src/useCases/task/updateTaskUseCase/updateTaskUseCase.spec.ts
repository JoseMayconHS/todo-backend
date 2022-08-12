import { TaskRepository } from './../../../repositories/repositories'
import { UpdateTaskUseCase } from './updateTaskUseCase'

describe('Update Task', () => {
	const mockTaskRepository = new TaskRepository()

	const updateTaskUseCase = new UpdateTaskUseCase(mockTaskRepository)

	it('should be able update task', async () => {
		await expect(
			updateTaskUseCase.execute('123', { title: 'Oi' })
		).resolves.not.toThrow()
	})

	it('should not be able update task without data to update', async () => {
		await expect(updateTaskUseCase.execute('123', {})).rejects.toThrow()
	})

	it('should not be able update task without id', async () => {
		await expect(updateTaskUseCase.execute('', {})).rejects.toThrow()
	})
})
