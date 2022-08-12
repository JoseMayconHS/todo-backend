import { TaskRepository } from '../../../repositories/repositories'
import { FindByWorkspaceUseCase } from './FindByWorkspaceUseCase'

describe('Find Tasks by workspace', () => {
	const taskRepository = new TaskRepository()

	const findByWorkspaceUseCase = new FindByWorkspaceUseCase(taskRepository)

	it('should not be able find tasks without workspace_id', async () => {
		await expect(findByWorkspaceUseCase.execute('')).rejects.toThrow()
	})

	it('should be able find tasks by workspace_id', async () => {
		await expect(findByWorkspaceUseCase.execute('123')).resolves.not.toThrow()
	})
})
